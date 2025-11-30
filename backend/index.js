const mongoose = require("mongoose");
const express = require("express");
const route = require("./src/routes/route");
const app = express();

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-api-key');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb+srv://group22:1234@group22databse.uvtoalh.mongodb.net/group28Database",
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));
app.use("/", route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log("Express port is running on " + PORT);
});
