const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const attemptedQuestionSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "mcq", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "course", required: true },
  courseName: { type: String, required: true },  // New field for easier lookup
  attempts: { type: Number, default: 1 },
  isCorrect: { type: Boolean, required: true },
});

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      minlength: [3, "Fullname name must be at least 3 characters long"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: [5, "Email be at least 3 characters long"],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    image: {
      type: String,
      required: false,
      maxlength: [
        100,
        "Image Url with more than 100 character is not allowed !",
      ],
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"], // You can extend this if you have other roles
      default: "USER", // Default value is "USER"
    },
    mcqProgress: {
      totalQuestions: { type: Number, default: 0 },
      attemptedQuestions: [attemptedQuestionSchema],
    },
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, r: this.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "60d",
    }
  );
  return token;
};

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.statics.hashPassword = async function (password) {
  return await bcrypt.hash(password, 10);
};

const userModal = mongoose.model("user", userSchema);

module.exports = userModal;
