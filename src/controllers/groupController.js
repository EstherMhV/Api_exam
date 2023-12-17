const Group = require('../models/groupModel');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_KEY;


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
        const userId = decoded.userId;


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



/* This code verifies both the user token and the invitation token,
checks that the user accepting the invitation is the invitee,
and then proceeds as before. If the user token or the invitation token is invalid,
jwt.verify will throw an error and the function will send a 500 response. 
If the user trying to accept the invitation is not the invitee, 
the function will send a 403 response.*/

/* Ne marche pas , UserId est undefined , j'ai double checker les tokken en checkant
si j'ai passer en parametre les bonnes variables et cela me semble bons mais je n'ai trouvée 
de solution,probablement un probleme de syntaxe quelque part 
ou une inatention de ma part quelque part
mais ne marche toujours pas*/
exports.acceptInvitation = async (req, res) => {
    const invitationToken = req.body.token;
    const userToken = req.headers['authorization'];

    try {
        // Verify the user token
        const { userId } = jwt.verify(userToken, process.env.JWT_KEY);

        // Verify the invitation token
        const { inviteeId ,senderGroupId} = jwt.verify(invitationToken, process.env.JWT_KEY);


        console.log("userId");
        console.log(userId);

        console.log("inviteeId");
        console.log(inviteeId.inviteeId);

        console.log("groupId");
        console.log(senderGroupId);


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
        const group = await Group.findById(senderGroupId);
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
        invitee.group_id = senderGroupId;
        group.invitations.splice(invitationIndex, 1); // Remove the invitation

        // Save the changes
        await group.save();
        await invitee.save();

        res.status(200).json({ message: 'Invitation accepted' });
    } catch (error) {
        res.status(500).json({ message: 'Error accepting invitation', error });
    }
}



/*This method gets the invitationToken from the request body, 
verifies the token, finds the group, checks if the invitation exists, 
removes the invitation, and saves the changes. If any of these steps fail, 
it sends a 500 response with an error message. */
exports.declineInvitation = async (req, res) => {
    const invitationToken = req.body.token;

    try {
        // Verify the invitation token
        const { senderGroupId, inviteeId } = jwt.verify(invitationToken, process.env.JWT_KEY);

        // Find the group
        const group = await Group.findById(senderGroupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the invitation exists
        const invitationIndex = group.invitations.findIndex(invitation => invitation.token === invitationToken);
        if (invitationIndex === -1) {
            return res.status(404).json({ message: 'Invitation not found' });
        }

        // Remove the invitation
        group.invitations.splice(invitationIndex, 1);

        // Save the changes
        await group.save();

        res.status(200).json({ message: 'Invitation declined' });
    } catch (error) {
        res.status(500).json({ message: 'Error declining invitation', error });
    }
}


/* This method finds the group, 
check if admin_id == user Id,
checks if all invitations are accepted or declined, 
checks if there are at least two members in the group, 
shuffles the members, assigns a giver and a receiver to each member, 
and saves the changes. 
If a person is the giver for himself, he will be the receiver for another person, and vice versa, 
so a person will not be the giver and receiver for himself.*/
exports.assignSecretSanta = async (req, res) => {
    const groupId = req.params.id_group;

    try {
        // Find the group
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if the user is the admin of the group
        if (group.admin_id !== req.user.userId) {
            return res.status(403).json({ message: 'User is not the admin of the group' });
        }
        try {
            // Find the group
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Check if all invitations are accepted or declined
            if (group.invitations.length > 0) {
                return res.status(400).json({ message: 'Not all invitations are accepted or declined' });
            }

            // Check if there are at least two members in the group
            if (group.members.length < 2) {
                return res.status(400).json({ message: 'Not enough members in the group' });
            }

            // Shuffle the members
            const shuffledMembers = group.members.sort(() => Math.random() - 0.5);

            // Assign a giver and a receiver to each member
            group.SecretSanta = shuffledMembers.map((member, index) => {
                return {
                    giver: member,
                    receiver: shuffledMembers[(index + 1) % shuffledMembers.length]
                };
            });
        }catch (error) {
            res.status(500).json({ message: 'Error checking admin', error });
        }
            // Save the changes
            await group.save();

            res.status(200).json({ message: 'Secret Santa assigned' });
    } catch (error) {
        res.status(500).json({ message: 'Error assigning Secret Santa', error });
    }
}




