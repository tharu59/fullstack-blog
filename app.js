// require("dotenv").config();
require("@dotenvx/dotenvx").config();
const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const MongoStore = require("connect-mongo").default;
const session = require("express-session");
const User = require("./models/User");
const userRoutes = require("./routes/authRoute");
const passportConfig = require("./config/passport");
const postRoutes = require("./routes/postRoute");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());

// port
const PORT = process.env.port || 3000;
// Host Name
const HOST = process.env.host || "localhost";

// Middleware
app.use(express.urlencoded({ extended: true }));

// session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  }),
);

// passport
passportConfig(passport);
app.use(passport.initialize());
app.use(passport.session());

// EJS
app.set("view engine", "ejs");

// Home Route main Route
app.use("/", userRoutes);
// app.use("/auth", userRoutes);
// Post route
app.use("/posts", postRoutes);

// error handler
app.use(errorHandler);

// database connection & server creation
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connected successfully");
    // server creation
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://${HOST}:${PORT}`);
    });
  })
  .catch(() => {
    console.log("Database connection failed");
  });

console.log("Hello ctk this is your own server");
