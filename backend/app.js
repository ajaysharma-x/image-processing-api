import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";
import imageRouter from './routes/image.routes.js'
// import { sendImg, testd } from "./controllers/csvparseController.js";
import cors from 'cors'
import statusRouter from "./routes/status.routes.js";

dotenv.config();
const app = express();
app.use(express.json()); // Ensure JSON support
app.use(cors({ origin: "*" })); // Allow all origins
// app.use(express.json());

app.use('/api/upload-csv', imageRouter);
app.use('/api/request-status', statusRouter)

// Sample Route
app.get("/", (req, res) => {
  res.send("API is running...");  
});

app.get("/upload-csv", (req, res) => {
  res.send("Upload CSV file api working in backend...");  
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
console.log(`Server running on port ${PORT}`);
await connectToDatabase();
});
