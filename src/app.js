import express from "express" 
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express() ;


const defaultOrigins = [
  "https://shoesweb-sooty.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
const extraOrigins =
  process.env.CLIENT_ORIGINS?.split(",").map((o) => o.trim()).filter(Boolean) ?? [];
const allowedOrigins = [...new Set([...defaultOrigins, ...extraOrigins])];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json({ limit: "512kb" }))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())




import { router } from "./Routes/User.route.js";

app.use("/api/v1/user" , router)

export {app}