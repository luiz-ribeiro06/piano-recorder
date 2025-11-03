require("dotenv").config();
const express = require("express");
const run = require("./config/db")
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

app.use(express.static("public"));

run().catch(console.dir);

app.get("/", (req, res) => {
  res.render("index", { 
    title: "Piano Recorder"
  });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
