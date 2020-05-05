const fs = require('fs');
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 3000
const bodyParser = require('body-parser')

app.set("view engine", "pug");
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("static"));

app.get('/', (req, res) => {
    res.render("index");
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))