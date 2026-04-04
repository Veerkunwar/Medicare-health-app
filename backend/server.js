import express from "express";
import cors from "cors";
import "dotenv/config";

import { clerkMiddleware } from "@clerk/express";
import { connectDB } from "./config/db.js";
import doctorRouter from "./routes/doctorRouter.js";
import serviceRouter from "./routes/serviceRouter.js";
import appointmentRouter from "./routes/appointmentRouter.js";
import serviceAppointmentRouter from "./routes/serviceAppointmentRouter.js";

const app = express();
const port = process.env.PORT || 4000;

// ✅ Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.FRONTEND_URL, // production frontend
];

// ✅ CORS (FIXED)
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("Incoming origin:", origin);

      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        (origin && origin.endsWith(".vercel.app"))
      ) {
        return callback(null, true);
      }

      console.log("Blocked by CORS:", origin);
      return callback(null, false); // ❗ crash nahi karega
    },
    credentials: true,
  })
);

// ✅ Handle preflight requests
app.options("*", cors());

// Middlewares
app.use(clerkMiddleware());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// ✅ DB connect properly
connectDB()
  .then(() => {
    console.log("Database connected");

    // Routes
    app.use("/api/doctors", doctorRouter);
    app.use("/api/services", serviceRouter);
    app.use("/api/appointments", appointmentRouter);
    app.use("/api/service-appointments", serviceAppointmentRouter);

    app.get("/", (req, res) => {
      res.json({ status: "OK", message: "API running" });
    });

    // Start server AFTER DB
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });