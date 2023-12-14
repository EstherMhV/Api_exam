const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config()

exports.listAllUsers = async function (req, res) {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur server response" });
        console.log(error);
    }
}

exports.register = async (req, res) => {
    try {
        const newUser = new User(req.body);
        const user = await newUser.save();
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        res.status(201).json({ message: `Utilisateur crée: ${user.email}` });
    } catch (error) {
        res.status(400).json({ message: "invalid request" });

    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }
        if (user.email === req.body.email && user.password === req.body.password) {
            const userData = {
                id: user._id,
                email: user.email,
                password: user.password,
                firstName: user.firstName,
            };
            const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY, { expiresIn: "10h" });
            res.status(200).json({ token });
        } if (!validPassword) {
            res.status(401).json({ message: "password incorrect" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "an error occured" });
    }
};

exports.updateAUser = async (req, res) =>{
    try {
        const user = await User.findByIdAndUpdate(req.params.id_user,req.body, {new : true});
        res.status(201);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({message:"Error server response"});
        console.log(error);
    }
}

exports.deleteAUser = async (req, res) =>{
    try {
        const user = await User.findByIdAndDelete(req.params.id_user);
        res.status(201);
        res.json({message:"User deleted successfully"});
    }
    catch (error) {
        res.status(500).json({message:"Erreur server response"});
        console.log(error);
    }
}

exports.getAUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id_user);
        res.status(200);
        res.json(user);
    }
    catch (error) {
        res.status(500);
        console.log(error);
        res.json({message:"Erreur serveur"});
    }
}
