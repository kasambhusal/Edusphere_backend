const mongoose = require("mongoose");

const mcqSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Generate unique _id for each MCQ
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correct: { type: String, required: true },
  complexity: { type: Number, required: true, min: 1, max: 4 },
});

const courseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    total: { type: Number, default: 0 }, // Auto-updated
    mcqs: { type: [mcqSchema], default: [] },
  },
  { timestamps: true } // Auto-generates createdAt & updatedAt
);

courseSchema.pre("save", function (next) {
  this.total = this.mcqs.length;
  next();
});

module.exports = mongoose.model("Course", courseSchema);
