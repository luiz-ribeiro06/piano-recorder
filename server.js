const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Servidor rodando... por enquanto.");
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
