import dotenv from "dotenv";
dotenv.config();

import app from "./server";
import express from "express";
import authRoutes from "./routes/auth.routes";
import cookieParser from "cookie-parser";
import vaultRoutes from './routes/vault.routes'
import filesRoutes from "./routes/files.routes";
import morgan from "morgan";
import recoveryRoutes from "./routes/recovery.routes";
import passport from "passport";
import "./controllers/google.strategy";
import usersRoutes from "./routes/users.routes";
import cors from "cors";

const PORT = 3131;
app.set("trust proxy", 1);

app.use(morgan("combined"));

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://localhost:5173",
        "https://securekit.k31.tech"
    ],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());


app.use("/recovery", recoveryRoutes);
app.use("/v1/auth", authRoutes);
app.use("/vault",vaultRoutes);
app.use("/files",filesRoutes);


app.use("/users", usersRoutes);






app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

