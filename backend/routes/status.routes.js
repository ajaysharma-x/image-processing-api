import { Router } from "express";
import checkStatus from "../controllers/statusController.js";

const statusRouter = Router();

statusRouter.get('/:request_id', checkStatus);
// statusRouter.post("/status", checkStatus);

export default statusRouter;