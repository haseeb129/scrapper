const express = require("express");
const checkAppointments = require("./check-appointment");
const app = express();

app.get("/", async (req, res) => {
  res.send("Hello from Node.js!");
});

app.get("/checkAppointments", checkAppointments);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
