const express = require("express");
const cors = require("cors");
const http = require('http');
const app = express();

var corsOptions = {
  // origin: "https://...app"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());  /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));   /* bodyParser.urlencoded() is deprecated */

app.get("/", (req, res) => {
  res.json({ message: "Welcome." });
});

require("./app/routes/routes")(app);

// set port, listen for requests
const PORT = 3000;
http.createServer(app).listen(PORT);
console.log(`Server is running on port ${PORT}.`);
