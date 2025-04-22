const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectToDb = require("./db/db");
const userRoutes = require("./routes/user.routes");
const clubRoutes = require("./routes/clubs.routes");
const OpportunityRoute = require("./routes/opportunities.routes");
const publicOpportunityRoute = require("./routes/public.opportunities.routes");
const CoursesRoute = require("./routes/courses.routes");
const PublicCoursesRoute = require("./routes/public.course.routes");
const validateToken = require("./middlewares/auth.middleware");
const validateAdminToken = require("./middlewares/adminValidation.middleware");

connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  console.log("Ping received at /"); 
  res.send("Hello World");
});
app.use("/users", userRoutes);
app.use("/clubs", validateToken, clubRoutes);
app.use("/opportunities", validateAdminToken, OpportunityRoute);
app.use("/public/opportunities", validateToken, publicOpportunityRoute);
app.use("/courses", validateAdminToken, CoursesRoute);
app.use("/public/courses", validateToken, PublicCoursesRoute);

module.exports = app;
