const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courses.controller");
const userController = require("../controllers/user.controller");

// Course Routes
router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", courseController.addCourse);
router.post("/:id/mcq", courseController.addMcqToCourse);
router.delete("/:id/mcq/:mcqId", courseController.deleteMcqFromCourse);
router.get("/get/practise-review/:user_id", userController.getReview);

module.exports = router;
