import express from "express";
import cors from "cors";
import vendorRoutes from "./routes/VendorRoutes";
import authRoutes from "./routes/AuthRoutes";
import hirerRoutes from "./routes/HirerRoutes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/vendor", vendorRoutes);
app.use("/auth", authRoutes);
app.use("/hirer", hirerRoutes);

app.get("/", (req, res) => {
    res.send("Venue Vendor Backend Running");
});

export default app;
