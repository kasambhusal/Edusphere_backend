const mongoose = require("mongoose");

const OpportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    from: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: false,
      },
    },
    category: { type: String, required: true },
    type: { type: String, required: true },
    status: {
      type: String,
      enum: ["Competition", "Open", "Coming Soon"],
      required: true,
    },
    text: { type: String, required: true },
  },
  { timestamps: true } // Automatically creates createdAt & updatedAt
);

const Opportunity = mongoose.model("Opportunity", OpportunitySchema);
module.exports = Opportunity;
