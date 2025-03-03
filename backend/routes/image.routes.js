import { Router } from "express";
import multer from "multer";
import uploadCsv from "../controllers/imageController.js";

const imageRouter = Router();

const upload = multer({ dest: "uploads/" })

imageRouter.post("/", upload.single("csvFile"), uploadCsv);

export default imageRouter;