import Request from "../models/Request.js";
import Product from "../models/product.js";

const checkStatus = async (req, res) => {
    try {
        const request = await Request.findOne({ request_id: req.params.request_id });
        if (!request) return res.status(404).json({ message: "Request not found" });

        const products = await Product.find({ request_id: req.params.request_id });
        const requests = await Request.find({ request_id: req.params.request_id })
        res.json({ request_id: request.request_id, status: request.status, products, requests });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default checkStatus;