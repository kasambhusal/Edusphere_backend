const Course = require("../models/courses.model");

// Get all courses
const getAllCourses = async () => {
  return await Course.find();
};

// Get a single course by ID
const getCourseById = async (id) => {
  return await Course.findById(id);
};
const getCourseByName = async (name) => {
  return await Course.findOne({ name: name });
};

const addCourse = async (courseData) => {
  // if (!Array.isArray(courseData.mcqs)) {
  //   throw new Error("MCQs must be an array.");
  // }

  // courseData.mcqs = courseData.mcqs.filter(
  //   (mcq) => mcq.question && mcq.options && mcq.correct && mcq.complexity
  // ); // Remove incomplete MCQs if necessary

  const newCourse = new Course(courseData);
  return await newCourse.save();
};

// Add an MCQ to a course
const addMcqToCourse = async (courseId, mcq) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  course.mcqs.push(mcq);
  course.total = course.mcqs.length; // Update count
  return await course.save();
};

// Delete MCQ from a course
const deleteMcqFromCourse = async (courseId, mcqId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  course.mcqs = course.mcqs.filter((m) => m.id !== mcqId);
  course.total = course.mcqs.length; // Update count
  return await course.save();
};

module.exports = {
  getAllCourses,
  getCourseById,
  getCourseByName,
  addCourse,
  addMcqToCourse,
  deleteMcqFromCourse,
};
