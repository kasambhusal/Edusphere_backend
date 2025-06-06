const userModal = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports.createUser = async ({ fullname, email, image, password }) => {
  if (!fullname || !email || !password) {
    throw new Error("All fields are required");
  }
  const user = userModal.create({
    fullname,
    email,
    image,
    password,
  });
  return user;
};

module.exports.authenticateEmail = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }
  const user = await userModal.findOne({ email }, "id email image fullname"); // Only fetch required fields
  if (user) {
    return user; // Return user object with id, email, image, and name
  } else {
    return null; // Return null if no user found
  }
};

module.exports.findUserById = async (id) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const user = await userModal.findById(id, "id email image fullname");
  return user || null; // Return the user if found, otherwise null
};

module.exports.authenticateUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find the user by email and include the password field
  const user = await userModal.findOne({ email }).select("+password");
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Compare the provided password with the stored hash
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // Generate a JWT token
  const token = user.generateAuthToken();

  // Return the token and user data (excluding the password)
  return {
    token,
    user: {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      image: user.image,
      role: user.role,
    },
  };
};

// Simulating an in-memory blacklist for tokens (use a database/Redis for production)
let tokenBlacklist = new Set();
// Function to add token to blacklist
module.exports.addToBlacklist = (token) => {
  tokenBlacklist.add(token); // Add token to the blacklist
  console.log("Token added to blacklist:", token);
};

// Function to check if token is blacklisted
module.exports.isTokenBlacklisted = (token) => {
  return tokenBlacklist.has(token); // Check if the token is blacklisted
};

// update user data
module.exports.updateUser = async (id, updateData) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  const { fullname, email, image } = updateData;
  const updates = {};

  if (fullname) updates.fullname = fullname;
  if (email) updates.email = email;
  if (image) updates.image = image;

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields provided to update");
  }

  const updatedUser = await userModal.findByIdAndUpdate(
    id,
    { $set: updates },
    { new: true, fields: "_id fullname email image" }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};
