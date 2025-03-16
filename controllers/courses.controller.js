const courseService = require("../services/courses.service");

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.json({ data: courses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single course
const getCourseByName = async (req, res) => {
  try {
    const courseName = req.params.name; // Get course name from request params
    const course = await courseService.getCourseByName(courseName); // Call service function
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ data: course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Get a single course
const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id; // Get course name from request params
    const course = await courseService.getCourseById(courseId); // Call service function
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json({ data: course });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new course
const addCourse = async (req, res) => {
  try {
    const newCourse = await courseService.addCourse(req.body);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add an MCQ to a course
const addMcqToCourse = async (req, res) => {
  try {
    const updatedCourse = await courseService.addMcqToCourse(
      req.params.id,
      req.body
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an MCQ
const deleteMcqFromCourse = async (req, res) => {
  try {
    const updatedCourse = await courseService.deleteMcqFromCourse(
      req.params.id,
      req.params.mcqId
    );
    res.json(updatedCourse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseByName,
  getCourseById,
  addCourse,
  addMcqToCourse,
  deleteMcqFromCourse,
};
