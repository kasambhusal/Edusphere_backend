const express = require("express");
const router = express.Router();
const OpportunityController = require("../controllers/opportunities.controller.js");

router.get("/get/", OpportunityController.getAllOpportunities); // Get all opportunities

module.exports = router;
