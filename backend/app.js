import express from "express";
import dotenv from "dotenv";
import connectToDatabase from "./database/mongodb.js";
import imageRouter from './routes/image.routes.js'
// import { sendImg, testd } from "./controllers/csvparseController.js";
import cors from 'cors'
import statusRouter from "./routes/status.routes.js";

dotenv.config();
const app = express();
app.use(cors());
// app.use(express.json());

app.use('/api/upload-csv', imageRouter);
app.use('/api/request-status', statusRouter)

// Sample Route
app.get("/", (req, res) => {
  res.send("API is running...");

  
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
console.log(`Server running on port ${PORT}`);
await connectToDatabase();
});
