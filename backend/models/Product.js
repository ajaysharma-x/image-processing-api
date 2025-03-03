import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    request_id: {
        type: String,
        required: true,
        unique: true,
        ref: 'Request'
    },
    product_name: {
        type: String,
        required: true
    },
    input_images_urls: {
        type: [String], // Array of image URLs
        required: true
    },
    output_images: {
        type: [String], // Array of processed image URLs
        default: []
    },
    status: {
        type: String,
        enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
        default: 'PENDING'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

export default Product;