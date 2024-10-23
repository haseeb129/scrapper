const express = require("express");
const checkAppointments = require("./api/check-appointment");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Node.js!");
});

app.get("/checkAppointments", checkAppointments);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
