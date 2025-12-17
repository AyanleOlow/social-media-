import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import tweetRoutes from "./routes/tweets";

const app = express();


app.use(cors({ origin: "http://localhost:3000", credentials: true })); 
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/tweets", tweetRoutes);


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
