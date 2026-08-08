const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// @desc Register User
// @route POST /api/auth/register
// @access Public

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate Input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        // Check Existing User
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Check User Creation
        if (!user) {
            return res.status(500).json({
                success: false,
                message: "Failed to create user"
            });
        }

        // Generate JWT
        const token = generateToken(user._id);

        // Response
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                greenScore: user.greenScore,
                xp: user.xp,
                streak: user.streak,
                badges: user.badges
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body;

        // Validation
        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });

        }

        // Find User
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }

        // Generate Token
        const token = generateToken(user._id);

        res.status(200).json({

            success: true,
            message: "Login Successful",

            token,

            user: {

                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                greenScore: user.greenScore,
                xp: user.xp,
                streak: user.streak,
                badges: user.badges

            }

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Internal Server Error"

        });

    }

}

const getProfile = async (req, res) => {

    res.status(200).json({

        success:true,

        user:req.user

    });

}

module.exports = {
    registerUser,
    loginUser,
    getProfile
};