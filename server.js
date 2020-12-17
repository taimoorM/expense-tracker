const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { port, mongoURI } = require("./config");
const transactionsRoutes = require("./routes/transactions");

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

app.use("/api/transactions", transactionsRoutes);

app.get("/", (req, res) => res.send("hello world"));

app.listen(port, () => console.log("express is running at port " + port));
