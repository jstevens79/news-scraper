const express = require("express");
const mongoose = require("mongoose")

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

const routes = require('./controllers/index');
app.use(routes);

const DB = process.env.MongoDB_URI || "mongodb://admin1:password1@ds225840.mlab.com:25840/heroku_v0qls6hj"

mongoose.connect(DB, { useMongoClient: true, useNewUrlParser: true});

app.listen(PORT, () => console.log(`App running on port ${PORT}.`))

MongoDB_URI