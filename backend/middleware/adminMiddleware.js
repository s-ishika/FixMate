
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    console.log("Admin check userId:", req.userId);

    const user = await User.findById(req.userId).select("name email role");

    if (!user || user.role !== "admin") {
      return res.status(403).json({
  message: "Access denied. Admin permission required.",
   });
  }

    next();
  } catch (error) {
    console.error("Admin authorization error:", error);

    return res.status(500).json({
      message: "Failed to verify admin permission.",
    });
  }
};

module.exports = adminMiddleware;
