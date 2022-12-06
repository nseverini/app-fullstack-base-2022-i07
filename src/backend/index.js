//=======[ Settings, Imports & Data ]==========================================

const PORT = 3000;

const express = require("express");
const app = express();
const devicesRoutes = require("./routes/devices.routes");

// To parse application/json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// To serve static files
app.use(express.static("/home/node/app/static/"));

//=======[ Main module code ]==================================================

// Endpoint for devices
app.use("/api/devices", devicesRoutes);

app.listen(PORT, function (req, res) {
  console.log("NodeJS API running correctly");
});
