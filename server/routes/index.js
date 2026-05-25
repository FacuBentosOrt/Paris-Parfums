import { Router } from "express";
import healthRoutes from "./healthRoutes.js";
import perfumeRoutes from "./perfumeRoutes.js";

const apiRoutes = Router();

apiRoutes.use("/health", healthRoutes);
apiRoutes.use("/perfumes", perfumeRoutes);

export default apiRoutes;
