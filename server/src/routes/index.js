import { Router } from "express";
import { authRouter } from "./auth.js";
import { carsRouter } from "./cars.js";
import { bookingsRouter } from "./bookings.js";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/cars", carsRouter);
apiRouter.use("/bookings", bookingsRouter);
