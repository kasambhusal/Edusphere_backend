const express = require("express");
const { param } = require("express-validator"); // Add this line
const router = express.Router();
const OpportunityController = require("../controllers/opportunities.controller.js");

router.get(
  "/getbyId/:id",
  [param("id").isMongoId().withMessage("Invalid opportunity ID format")],
  OpportunityController.getOpportunityById
); // Get opportunity by ID
router.post("/post/", OpportunityController.createOpportunity); // Create new opportunity
router.put(
  "/put/:id",
  [param("id").isMongoId().withMessage("Invalid opportunity ID format")],
  OpportunityController.updateOpportunity
); // Update an opportunity
router.delete(
  "/delete/:id",
  [param("id").isMongoId().withMessage("Invalid opportunity ID format")],
  OpportunityController.deleteOpportunity
); // Delete an opportunity

module.exports = router;
