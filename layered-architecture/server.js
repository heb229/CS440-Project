import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import critiqueRoute from "./presentation-layer/routes/critiqueRoute.js";
import movieRoute from "./presentation-layer/routes/movieRoute.js"
import personRoute from "./presentation-layer/routes/personRoute.js"

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, "presentation-layer/public")));

app.use("/api/critiques", critiqueRoute);
app.use("/api/movies", movieRoute);
app.use("/api/person", personRoute);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "presentation-layer/public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
