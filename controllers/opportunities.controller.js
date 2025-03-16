const Opportunity = require("../models/opportunities.model.js");
const userService = require("../services/user.service");
const opportunityService = require("../services/opportunities.service.js");


module.exports.getAllOpportunities = async (req, res) => {
    try {
      const { category } = req.query;
      const filter = category ? { category } : {};
      const opportunities = await Opportunity.find(filter).populate("from", "fullname email");
      res.status(200).json(opportunities);
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
// Get a single opportunity by ID
module.exports.getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "from",
      "fullname email"
    );
    if (!opportunity)
      return res.status(404).json({ message: "Opportunity not found" });
    res.status(200).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Create a new opportunity
module.exports.createOpportunity = async (req, res) => {
  try {
    const { title, user_email, category, type, status, text } = req.body;

    // Fetch the user from the database
    const user = await userService.authenticateEmail({ email: user_email });
    if (!user) {
      return res
        .status(400)
        .json({ errors: "User with this email doesn't exist!" });
    }

    const newOpportunity = new Opportunity({
      title,
      from: {
        id: user.id,
        name: user.fullname,
        email: user.email,
        image: user.image,
      },
      category,
      type,
      status,
      text,
      createdAt: new Date(),
    });

    // Save the post
    const post = await opportunityService.createNewOpportunity(newOpportunity);

    res.status(200).json({ message: "Opportunity Submitted!", data: post });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update an opportunity by ID
module.exports.updateOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedOpportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    res.status(200).json({
      message: "Opportunity updated successfully",
      opportunity: updatedOpportunity,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete an opportunity by ID (optional)
module.exports.deleteOpportunity = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOpportunity = await Opportunity.findByIdAndDelete(id);
    if (!deletedOpportunity)
      return res.status(404).json({ message: "Opportunity not found" });

    res.status(200).json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
