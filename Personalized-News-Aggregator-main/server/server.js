const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const connectDB = require("./config/db");
const newsRouter = require("./routes/newsRoutes");
const authRoutes = require("./routes/authRoutes");
const historyRoutes = require("./routes/historyRoutes");
const { jwtAuthMiddleware } = require("./middlewares/jwtMiddleware");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

connectDB();

// Routes
app.use("/news", jwtAuthMiddleware, newsRouter);
app.use("/users", authRoutes);
app.use("/history",jwtAuthMiddleware, historyRoutes);

// Testing
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
