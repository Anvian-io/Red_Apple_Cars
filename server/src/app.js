import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./controllers/user/userRoutes.js";
import roleRouter from "./controllers/roles/rolesRouter.js"
import userRouter from "./controllers/user_management/user_managementRoute.js";
import feedbackRoute from "./controllers/feedback/feedbackRouter.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";
import carsRouter from "./controllers/cars/CarsRouter.js"
import invoiceRouter from './controllers/invoices/invoiceRoute.js'
const app = express();

app.use(
    cors({
        origin: ["http://localhost:3000", "https://staging.redapplecars.com"],
        credentials: true
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/feedback", feedbackRoute);
app.use(verifyJWT);
app.use("/api/role", roleRouter);
app.use("/api/user_management", userRouter);
app.use("/api/cars", carsRouter);
app.use("/api/invoice", invoiceRouter);

export { app };
