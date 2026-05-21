import express from "express";
import cors from "cors";

import {AppDataSource} from "./data-source";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Venue Vendor Backend Running");
});

AppDataSource.initialize().then(() => {
    console.log("Database Connected");

    app.listen(3001, () => {
        console.log("Server running on 3001");
    });

}).catch((error) => {console.log(error)});