import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

import router from "./routers/index";
import { customErrorHandler, customSuccessHandler } from "./middlewares/customHandlers";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());

app.use(router);
app.use(customSuccessHandler);
app.use(customErrorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});