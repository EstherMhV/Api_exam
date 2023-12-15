const Group = require('../models/groupModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY;



// async function authenticate(req, res, next) {
//     const token = req.headers['authorization'];

//     try {
//         const decoded = jwt.verify(token, 'your-secret-key');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: 'Authentication failed' });
//     }
// }

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
    try {
        const groups = await User.findById(req.params.id_group);
        res.status(201).json(groups);
    } catch (error) {
        res.status(500).json({ message: "Error server response" });
        console.log(error);
    }
}


exports.createAGroup = async (req, res) => {
    const { name } = req.body;

    // Extract the token from the Authorization header
    const token = req.headers['authorization'];

    try {
        // Verify the token and extract the user's ID
        const decoded = jwt.verify(token, secretKey);
        const userId = decoded._id;

        // Create a new group
        const group = new Group({ name, admin_id: userId });

        // Save the group
        await group.save();

        // Find the user and update their groupId and role
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.group_id = group._id;
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
    const { email } = req.body;

    try {
        // Récupérer le token d'autorisation de l'entête de la requête
        const token = req.headers['authorization'];

        // Vérifier le token et extraire l'ID de l'utilisateur et l'ID du groupe
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        const senderGroupId = decoded.groupId;
        


        // Trouver le groupe de l'expéditeur
        const senderGroup = await Group.findById(senderGroupId);
        if (!senderGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Trouver l'utilisateur invité par son email
        const invitee = await User.findOne({ email });
        if (!invitee) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Générer un token d'invitation incluant l'ID du groupe de l'expéditeur
        const invitationToken = jwt.sign({ senderGroupId, inviteeId: invitee._id }, process.env.JWT_KEY, { expiresIn: '1d' });

        // Ajouter le token d'invitation aux invitations du groupe de l'expéditeur
        senderGroup.invitations.push({ inviteeId: invitee._id, token: invitationToken });
        await senderGroup.save();

        res.status(201).json({ message: 'Invitation sent', token: invitationToken });
    } catch (error) {
        res.status(500).json({ message: 'Error sending invitation', error });
        
    }
}

exports.acceptInvitation = async (req, res) => {
    const invitationToken = req.body.token;
    const userToken = req.headers['authorization'];

    try {
        // Verify the user token
        const { userId } = jwt.verify(userToken, process.env.JWT_KEY);

        // Verify the invitation token
        const inviteeId  = jwt.verify(invitationToken, process.env.JWT_KEY);

        console.log(userToken);
        console.log(invitationToken);

        // Ensure the user accepting the invitation is the invitee
        if (userId !== inviteeId) {
            return res.status(403).json({ message: 'User is not authorized to accept this invitation' });
            
        }

        // Find the invitee
        const invitee = await User.findById(inviteeId);
        if (!invitee) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the invitation exists
        const invitationIndex = group.invitations.findIndex(invitation => invitation.token === invitationToken);
        if (invitationIndex === -1) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        // Add the user to the group's members
        group.members.push(inviteeId);
        invitee.group_id = groupId;
        group.invitations.splice(invitationIndex, 1); // Remove the invitation

        // Save the changes
        await group.save();
        await invitee.save();

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

