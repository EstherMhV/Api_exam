const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Group = require('../models/groupModel');
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
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Check if any user already exists
        const existingUser = await User.findOne();
        const role = existingUser ? 'user' : 'admin';

        // Create a new user with the hashed password and role
        const newUser = new User({
            ...req.body,
            password: hashedPassword,
            role
        });

        const user = await newUser.save();

        res.status(201).json({ message: `Utilisateur crée: ${user.email}`, role: user.role });
    } catch (error) {
        res.status(400).json({ message: "invalid request", error });
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        // Compare the hashed password with the password from the request body
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return res.status(401).json({ message: "password incorrect" });
        }

        const userData = {
            id: user._id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
        };
        const token = jwt.sign({ userId: user._id, groupId: user.group_id }, process.env.JWT_KEY, { expiresIn: '1d' });
        res.status(200).json({ token });
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
        res.status(201);
        res.json(user);
    }
    catch (error) {
        res.status(500);
        console.log(error);
        res.json({message:"Erreur serveur"});
    }
}


// Define an asynchronous function named 'getAssignment'
exports.getAssignment = async (req, res) => {
    try {
        // Extract the user ID from the request parameters
        const userId = req.params.id_user;
        
        // Find the user with the given ID in the database
        const user = await User.findById(userId);
    
        // If no user is found, return a 404 status code and a message
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find a group where the user is a giver in the SecretSanta array
        // Populate the 'receiver' field in the SecretSanta array with the actual user documents
        const group = await Group.findOne({ 'SecretSanta.giver': userId }).populate('SecretSanta.receiver');
        
        // If no group is found, return a 404 status code and a message
        if (!group) {
            return res.status(404).json({ message: 'No Secret Santa assignment found for this user' });
        }

        // Find the assignment in the SecretSanta array where the user is the giver
        const assignment = group.SecretSanta.find(assignment => assignment.giver.toString() === userId);
        
        // Return the first name of the receiver in the found assignment
        res.json({ "Your are the Secret Santa of ": assignment.receiver.firstName });
    } catch (err) {
        // If an error occurs, return a 500 status code and the error message
        res.status(500).json({ message: err.message });
    }
};