const express = require("express");
const router = express.Router();
const { body, param } = require("express-validator");
const clubsController = require("../controllers/clubs.controller");

const menuItems = [
  { key: "1", label: "Physics Club" },
  { key: "2", label: "Math Club" },
  { key: "3", label: "Computer Club" },
  { key: "4", label: "Chemistry Club" },
  { key: "5", label: "Literature Club" },
  { key: "6", label: "Geography Club" },
];

// Convert all labels to lowercase for validation
const validCategories = menuItems.map((item) => item.label.toLowerCase());

router.post(
  "/post",
  [
    body("title")
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be between 1 to 100 characters long"),

    body("text").custom((value) => {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount < 1 || wordCount > 1000) {
        throw new Error("Text must be between 1 to 1000 words long");
      }
      return true;
    }),

    body("category").custom((value) => {
      if (!validCategories.includes(value.toLowerCase())) {
        throw new Error("Category must be one of the predefined club names");
      }
      return true;
    }),

    body("image")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid image URL"),

    body("user_email").isEmail().withMessage("Invalid Email"),
  ],
  clubsController.publishPost
);

router.get(
  "/get/:categoryname",
  [
    param("categoryname")
      .custom((value) => {
        if (!validCategories.includes(value.toLowerCase())) {
          throw new Error("Invalid category name");
        }
        return true;
      })
      .withMessage("Invalid category name"),
  ],
  clubsController.getPostsByCategory
);

router.get(
  "/get/id/:postId",
  [param("postId").isMongoId().withMessage("Invalid post ID format")],
  clubsController.getPostsById
);

router.post("/post/like", clubsController.likePost);
router.post("/post/unlike", clubsController.unlikePost);
router.get("/get/like/:post_id", clubsController.getLikesForPost);
router.post(
  "/post/comment",
  [body("user_email").isEmail().withMessage("Invalid Email")],
  clubsController.addComment
);

module.exports = router;
