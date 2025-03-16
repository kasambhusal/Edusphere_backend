const OpportunityModal = require("../models/opportunities.model");

module.exports.findAllOpportunities = async (category) => {
  const filter = category ? { category } : {};
  return await OpportunityModal.find(filter).populate("from", "fullname email");
};

module.exports.findOpportunityById = async (id) => {
  return await OpportunityModal.findById(id).populate("from", "fullname email");
};

module.exports.createNewOpportunity = async (data) => {
  if (!data.title || !data.status || !data.category) {
    throw new Error("All fields are required");
  }

  const post = await OpportunityModal.create(data);
  return post;
};

module.exports.updateOpportunityById = async (id, data) => {
  return await OpportunityModal.findByIdAndUpdate(id, data, { new: true });
};

module.exports.deleteOpportunityById = async (id) => {
  return await OpportunityModal.findByIdAndDelete(id);
};
