import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
    request_id: {
        type: String,
        required: true,
        unique: true
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

const Request = mongoose.model('Request', RequestSchema);

export default Request;