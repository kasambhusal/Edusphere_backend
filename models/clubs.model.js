const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    comments: [
      {
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
        text: {
          type: String,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    shares: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
);

const clubsModal = mongoose.model("post", postSchema);

module.exports = clubsModal;
