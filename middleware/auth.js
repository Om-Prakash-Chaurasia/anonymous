const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const auth = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ msg: "Token not found, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID and exclude password
    const user = await User.findById(decoded.id).select("-password");
    console.log(user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error : ", error);
    res.status(401).json({ msg: " Invalid or expired token" });
  }
};

module.exports = auth;
