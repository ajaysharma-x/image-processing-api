import { nanoid } from 'nanoid';
import axios from 'axios';
import sharp from 'sharp';
import fs from 'fs'
import csv from 'csv-parser'

import Product from '../models/Product.js';
import Request from '../models/Request.js';

const compressImage = async (imageUrl) => {
    try {
        // Fetch image from URL
        const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
        });

        // Detect image format
        const metadata = await sharp(response.data).metadata();
        if (!["jpeg", "png", "webp"].includes(metadata.format)) {
            throw new Error(`Unsupported image format: ${metadata.format}`);
        }

        // Compress image to 50% quality
        const compressedImageBuffer = await sharp(response.data)
            .resize({ width: 500 })  // Resize while maintaining aspect ratio
            .toFormat("jpeg")        // Convert to JPEG (if not already)
            .jpeg({ quality: 50 })   // Set quality to 50%
            .toBuffer();

        // Convert to Base64
        return `data:image/jpeg;base64,${compressedImageBuffer.toString("base64")}`;
    } catch (error) {
        console.error("Error compressing image:", error.message);
        throw new Error("Image compression failed. Make sure the URL is an actual image.");
    }
};

export const uploadCsv = async (req, res) => {

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const results = [];

    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => {
            results.push({
                product_name: row["Product Name"]?.trim(),
                input_images_urls: row["Input Image Urls"] ? row["Input Image Urls"].split(",").map(url => url.trim()) : []
            });
        })
        .on("end", async () => {
            fs.unlinkSync(req.file.path); // Delete temp file after parsing

            try {
                // Create a new request ID
                const requestId = nanoid();

                if (!Array.isArray(results) || results.length === 0) {
                    return res.status(400).json({ error: "Invalid CSV data" });
                }

                // Save the request in the database
                await Request.create({ request_id: requestId, status: "PENDING" });

                let failedImages = [];

                // Process each product
                for (const product of results) {
                    const productEntry = await Product.create({
                        request_id: requestId,
                        product_name: product.product_name,
                        input_images_urls: product.input_images_urls,
                        output_images: [],
                        status: "PENDING",
                    });

                    let compressedImages = [];

                    try {
                        for (const imageUrl of product.input_images_urls) {
                            try {
                                const compressedImage = await compressImage(imageUrl);
                                compressedImages.push(compressedImage);
                            } catch (compressionError) {
                                console.error("Compression failed:", compressionError.message);
                                failedImages.push({ product_name: product.product_name, imageUrl });
                            }

                        }

                        await Product.updateOne(
                            { _id: productEntry._id },
                            {
                                $set: {
                                    output_images: compressedImages,
                                    status: compressedImages.length > 0 ? "COMPLETED" : "FAILED",
                                },
                            }
                        );


                    } catch (error) {
                        console.error("Product processing failed:", error);
                        failedImages.push({ product_name: product.product_name, error: error.message });

                        await Product.updateOne(
                            { _id: productEntry._id },
                            { $set: { status: "FAILED" } }
                        );
                        await Request.updateOne(
                            { request_id: requestId },
                            { $set: { status: "FAILED" } }
                        );
                    }
                }
                

                if (failedImages.length > 0) {
                    return res.status(207).json({
                        request_id: requestId,
                        message: "CSV processed with some errors.",
                        failedImages,
                    });
                } else {
                    await Request.updateOne(
                        { request_id: requestId },
                        { $set: { status: "COMPLETED" } }
                    );
                }

                res.json({ request_id: requestId, message: "CSV processed and images saved." });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
        })
        .on("error", (err) => {
            console.error("CSV Parsing Error:", err);
            res.status(500).json({ error: "Failed to parse CSV" });
        });
};



export default uploadCsv;
