const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const courseController = require("../controllers/courses.controller");

router.get("/", courseController.getAllCourses);
router.get("/:name", courseController.getCourseByName);
router.post("/update-mcq", userController.updateUserMCQProgress);

module.exports = router;
