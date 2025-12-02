require("dotenv").config();
const express = require("express");
const run = require("./config/db");
const cors = require("cors");

var indexRouter = require("./routes/index");
var recordingsRouter = require("./routes/recordings");
var settingsRouter = require("./routes/settings");
var aboutRouter = require("./routes/about");

const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views');

app.use(express.static("public"));

app.use("/", indexRouter);
app.use("/recordings", recordingsRouter);
app.use("/settings", settingsRouter);
app.use("/about", aboutRouter);

run().catch(console.dir);

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}.`));
