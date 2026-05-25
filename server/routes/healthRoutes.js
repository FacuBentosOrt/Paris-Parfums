import { Router } from "express";
import { getDatabaseHealthController, getHealth } from "../controllers/healthController.js";

const healthRoutes = Router();

healthRoutes.get("/", getHealth);
healthRoutes.get("/db", getDatabaseHealthController);

export default healthRoutes;
