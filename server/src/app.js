const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

const authRouter = require("./routes/auth.routes");
const propertyRouter = require("./routes/property.routes");

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/property",propertyRouter);

module.exports = app;
