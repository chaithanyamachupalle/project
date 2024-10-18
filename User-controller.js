const bcrypt = require('bcrypt');
const User = require('../models/User');

// Get All Users (Read)
const getAllUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!users) {
        return res.status(404).json({ message: "Users not found" });
    }

    return res.status(200).json(users);
};

// Get User by ID (Read)
const getUserById = async (req, res, next) => {
    const userId = req.params.id;
    let user;
    try {
        user = await User.findById(userId);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
};

// Sign Up (Create)
const signup = async (req, res, next) => {
    const { username, email, phoneNumber, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    let existingUser;
    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({
        username,
        email,
        phoneNumber,
        password: hashedPassword
    });

    try {
        await user.save();
        return res.status(201).json(user);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Login (Authentication)
const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Incorrect password" });
    }

    return res.status(200).json(existingUser);
};

// Update Password (Update)
const updatePassword = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        await User.updateOne(
            { email },
            { $set: { password: hashedPassword } }
        );
        return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Update Profile (Update)
const updateProfile = async (req, res, next) => {
    const { email, username, phoneNumber } = req.body;
    let existingUser;

    try {
        existingUser = await User.findOne({ email });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        await User.updateOne(
            { email },
            { $set: { username, phoneNumber } }
        );
        return res.status(200).json({ message: "Profile updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Delete User (Delete)
const deleteUser = async (req, res, next) => {
    const userId = req.params.id;
    let user;

    try {
        user = await User.findByIdAndDelete(userId);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
};

module.exports = {
    getAllUsers,
    getUserById,
    signup,
    login,
    updatePassword,
    updateProfile,
    deleteUser
};
