const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register
const registerUser = async (req, res) => {
  const { name, email, password, mobileNo } = req.body;
  if (!name || !email || !password || !mobileNo) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ name, email, password, mobileNo });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      mobileNo: user.mobileNo,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          payload,
          token,
        });
      }
    );

    // res.status(200).send("Registration successful");
  } catch (error) {
    console.error("Registration error : ", error);
    res.status(500).send("Server error : ", error);
  }
};

// Login

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = {
      id: user._id,
      name: user.name,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;

        res.json({
          msg: `Welcome! ${payload.name}`,
          token,
        });
      }
    );
    // res.status(200).send("Login successful");
  } catch (error) {
    console.error("Login error : ", error);
    res.status(500).send("Server error : ", error);
  }
};

// Update
const updateUser = async (req, res) => {
  try {
    const { name, email, password, mobileNo } = req.body;

    const userId = req.user.id;

    const updateDetails = {};

    // Sanitize and validate fields before updating
    if (email) return res.send("Email can not be updated");
    if (name) updateDetails.name = name.trim();
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateDetails.password = await bcrypt.hash(password.trim(), salt);
    }
    if (mobileNo) updateDetails.mobileNo = mobileNo;

    // Update the user and return a new Document
    const user = await User.findByIdAndUpdate(userId, updateDetails, {
      new: true, // Returns the updated document
      runValidators: true, // Enforces Schema validation
    }).select("-password"); // Excludes password from response

    if (!user) {
      res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User updated successfully" });
  } catch (error) {
    console.error("Failed to update : ", error);
    res.status(500).send("Internal server error : ", error);
  }
};

// Delete
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    res.status(200).json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error("Delete request error : ", error);
    res.status(500).json({ msg: "Internal server error : ", error });
  }
};

module.exports = { registerUser, loginUser, updateUser, deleteUser };
