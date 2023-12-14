const Group = require('../models/groupModel');

exports.listAllGroups = async function (req, res) {
    try{
        const groups = await Group.find({});
        res.status(201).json(groups);
    }catch (error) {
        res.status(500).json({message:"Error server response"});
        console.log(error);
    }
}

exports.createAGroup = async (req, res) => {
    try{
        const newGroup = new Group(req.body);
        const group = await newGroup.save();
        res.status(201).json({message: `Group created: ${group.name}`});
    }catch (error) {
        res.status(400).json({message:"invalid request"});
    }
}

exports.updateAGroup = async (req, res) => {
    try{
        const group = await Group.findByIdAndUpdate(req.params.id_group, req.body, {new : true});
        res.status(201).json(group);
        res.json(group);
    }catch(error)
}