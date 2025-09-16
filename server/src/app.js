import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoute } from "./controllers/user/userRoutes.js";
import roleRouter from "./controllers/roles/rolesRouter.js";
import userRouter from "./controllers/user_management/user_managementRoute.js";
import feedbackRoute from "./controllers/feedback/feedbackRouter.js";
import feedbackWebsiteRoute from "./controllers/feedback/feedbackWebsiteRoutes.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";
import carsRouter from "./controllers/cars/CarsRouter.js";
import carsWebsiteRouter from "./controllers/cars/CarWebsiteRoutes.js";
import invoiceRouter from "./controllers/invoices/invoiceRoute.js";
import notificationRouter from "./controllers/notifications/notificationRoute.js";
const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://staging.redapplecars.com",
            "http://localhost:3001",
            "https://staging-bs.redapplecars.com"
        ],
        credentials: true
    })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/carsWebsite", carsWebsiteRouter);
app.use("/api/feedbackWebsite", feedbackWebsiteRoute);
app.use(verifyJWT);
app.use("/api/feedback", feedbackRoute);
app.use("/api/cars", carsRouter);
app.use("/api/role", roleRouter);
app.use("/api/user_management", userRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/invoice", invoiceRouter);

export { app };
