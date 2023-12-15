const Group = require('../models/groupModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');



exports.listAllGroups = async function (req, res) {
    try {
        const groups = await Group.find({});
        res.status(201).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error server response" });
        console.log(error);
    }
}

exports.getAGroup = async (req, res) => {
    try{
        const groups = await User.findById(req.params.id_group);
        res.status(201).json(groups);
    }catch (error) {
        res.status(500).json({message:"Error server response"});
        console.log(error);
    }
}

exports.createAGroup = async (req, res) => {
    const { name, userId } = req.body;

    // Create a new group
    const group = new Group({ name,admin:userId});

    try {
        // Save the group
        await group.save();

        // Find the user and update their groupId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.groupId = group._id;
        user.role = 'admin';
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

exports.sendInvitation = async (req, res) => {
    const { groupId, inviteeId } = req.body;

    try {
        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Generate an invitation token
        const invitationToken = jwt.sign({ groupId, inviteeId }, process.env.JWT_KEY, { expiresIn: '1d' });

        // Add the invitation token to the group's invitations
        group.invitations.push({ inviteeId, token: invitationToken });
        await group.save();

        res.status(201).json({ message: 'Invitation sent', token: invitationToken });
    } catch (error) {
        res.status(500).json({ message: 'Error sending invitation', error });
    }
}

exports.acceptInvitation = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the invitation token
        const { groupId, inviteeId } = jwt.verify(token, process.env.JWT_KEY);

        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the invitation exists
        const invitationIndex = group.invitations.findIndex(invitation => invitation.token === token);
        if (invitationIndex === -1) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        // Add the user to the group's members
        group.members.push(inviteeId);
        group.invitations.splice(invitationIndex, 1); // Remove the invitation
        await group.save();

        res.status(200).json({ message: 'Invitation accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting invitation', error });
    }
}

exports.declineInvitation = async (req, res) => {
    const { groupId, token } = req.body;

    try {
        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Find the invitation in the group's invitations and remove it
        const index = group.invitations.findIndex(invitation => invitation.token === token);
        if (index !== -1) {
            group.invitations.splice(index, 1);
            await group.save();
        }

        res.status(200).json({ message: 'Invitation declined' });
    } catch (error) {
        res.status(500).json({ message: 'Error declining invitation', error });
    }
}

