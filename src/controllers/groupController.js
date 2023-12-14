const Group = require('../models/groupModel');
const User = require('../models/userModel');

exports.listAllGroups = async function (req, res) {
    try {
        const groups = await Group.find({});
        res.status(201).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error server response" });
        console.log(error);
    }
}

exports.createAGroup = async (req, res) => {
    const { name, userId } = req.body;

    // Create a new group
    const group = new Group({ name });

    try {
        // Save the group
        await group.save();

        // Find the user and update their groupId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.groupId = group._id;
        await user.save();

        // Add the user to the group's members
        group.members.push(user._id);
        await group.save();

        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        res.status(500).json({ message: 'Error creating group', error });
    }
}

exports.updateAGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id_group, req.body, { new: true });
        res.status(201).json(group);
        res.json(group);
    } catch (error) {
        res.status(500).json({ message: "Error server response" });
        console.log(error);
    }
}

exports.deleteGroup = async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id_group);
        res.status(201).json({ message: `Group deleted: ${group.name}` });
    } catch (error) {
        res.status(500).json({ message: "Error server response" });
        console.log(error);
    }
}