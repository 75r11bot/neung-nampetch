import path from "path";
import url from "url";
import express from "express";
import * as fs from "fs";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5001;

app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
