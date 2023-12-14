const User = require('../models/userModel');

exports.listAllUsers = async function(req, res) {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({message: "Erreur serveur"});
        console.log(error);
    }
}

exports.register = async (req,res) =>{
    try {
        const newUser = new User(req.body);
        const user = await newUser.save();
        res.status(201).json({message: `Utilisateur crée: ${user.email}`});
    } catch (error) {
        res.status(400).json({message: "invalid request"});

    }
}

exports.login = async (req, res) => {
    try{
        const user = await User.findOne({email: req.body.email});
        if(user.email === req.body.email && user.password === req.body.password){
            res.status(200).json({message: "User connected successfully"});
            const userData = {
                id: user._id,
                email: user.email,
                password: user.password,
                firstName: user.firstName,
            };
        }else{
            res.status(401).json({message: "password incorrect"});
        }
    }catch(error){
        console.log(error);
        res.status(500).json({message: "an error occured"});
    }
};

exports.updateA