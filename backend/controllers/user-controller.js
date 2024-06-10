const User = require('../model/User');
const uploadImage = require('../utils/cloudinary');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const path = require('path');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const signup = async (req, res, next) => {
    const { fullname, name, email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        console.log("Something went wrong", error);
    }

    if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password);

    const user = new User({
        fullname: fullname,
        username: name,
        email,
        password: hashedPassword,
    });

    try {
        await user.save();
    } catch (error) {
        console.log(error);
    }

    return res.status(201).json({ message: user });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        return new Error(error);
    }

    if (!existingUser) {
        return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid details" });
    }

    const token = jwt.sign({ id: existingUser._id }, JWT_SECRET_KEY, {
        expiresIn: "2hr",
    });

    if (req.cookies['token']) {
        res.clearCookie('token');
    }

    res.cookie('token', token, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
        httpOnly: true,
        sameSite: 'None',
        secure: process.env.NODE_ENV === 'production',
    });

    return res.status(200).json({ message: "Successfully logged in", user: existingUser, token });
};

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token found" });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(400).json({ message: "Invalid token" });
        }
        req.id = user.id;
        next();
    });
};

const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "-password");
    } catch (error) {
        return new Error(error);
    }

    if (!user) {
        return res.status(404).json({ message: "User not found " });
    }

    return res.status(200).json({ user });
};

const refreshToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(400).json({ message: "No token found" });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
        if (err) {
            console.error("JWT verification error:", err);
            return res.status(403).json({ message: "Authentication failed" });
        }

        res.clearCookie('token');
        const newToken = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
            expiresIn: "2h"
        });

        res.cookie('token', newToken, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
            httpOnly: true,
            sameSite: 'None',
            secure: process.env.NODE_ENV === 'production',
        });

        req.id = user.id;
        next();
    });
};

const logout = (req, res, next) => {
    res.clearCookie('token', { path: '/', sameSite: 'None', secure: true });
    return res.status(200).json({ message: 'Successfully logged out' });
};


const updateProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await User.findOne({ username: username });
        const userId = user._id;

        const {
            fullname,
            location,
            githubUsername,
            linkedinUsername,
            skills,
            education,
        } = req.body;

        let imageUrl;
        if (req.file) {
            imageUrl = await uploadImage(req.file.path);
        }
        console.log("image url is",imageUrl);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                fullname,
                location,
                githubUsername,
                linkedinUsername,
                skills,
                education,
                ...(imageUrl && { profilePicture: imageUrl }),
            },
            { new: true }
        );

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getUserfromUsername = async (req, res) => {
    try {
        const username = req.query.username;
        const user = await User.findOne({ username: username });
        if (!user)
            return res.status(404).json({ message: "No user found" });

        return res.status(200).json(user);

    } catch (error) {
        console.error('Error getting user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.signup = signup;
exports.login = login;
exports.verifyToken = verifyToken;
exports.getUser = getUser;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.updateProfile = updateProfile;
exports.getUserfromUsername = getUserfromUsername;
