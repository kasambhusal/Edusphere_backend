const clubsModal = require("../models/clubs.model");

module.exports.createPost = async (postData) => {
  if (!postData.title || !postData.text || !postData.category) {
    throw new Error("All fields are required");
  }

  const post = await clubsModal.create(postData);
  return post;
};
