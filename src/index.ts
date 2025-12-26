import dotenv from "dotenv";
dotenv.config();
import app from "./server";
import express from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";

const PORT = 3131;

app.use(express.json());
app.use(cookieParser());

app.use("/v1/auth", authRoutes);





app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
