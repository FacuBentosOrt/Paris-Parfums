import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin
  })
);
app.use(express.json({ limit: env.jsonLimit }));

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
