const jwt = require('jsonwebtoken');
require('dotenv').config()

const Group = require('../models/groupModel');


exports.verifyToken = async(req, res, next) => {
    try{
        const token = req.headers['authorization'];
        if(token !== undefined) {
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token,process.env.JWT_KEY,(error,decoded) => {
                if(error) {
                    reject(error);
                    }else {
                        resolve(decoded);
                    }
                });
            });
            req.user = payload;
            next();
        }else{
            res.status(403).status(403).json({message:"Acces interdit: token manquant"});
        }   
    }catch(error){
        console.log(error);
        res.status(403).json({message:"Acces interdit : token invalide"});
    }
}

exports.verifyAdmin = (req, res, next) => {
    // Vérifiez si l'utilisateur est un admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'User is not an admin' });
    }
    // Si l'utilisateur est un administrateur, alors la fonction continue sa focntion
    next();
};

exports.verifyGroupAdmin = async (req, res, next) => {
    // Trouvez le groupe
    const group = await Group.findById(req.params.id_group);

    // Vérifiez si l'utilisateur est l'admin du groupe
    if (group.admin_id.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'User is not the admin of the group' });
    }

    // Si l'utilisateur est un admin, alors la fonction continue sa fonction
    next();
};

exports.verifyAdminOrGroupAdmin = async (req, res, next) => {
    // Trouvez le groupe
    const group = await Group.findById(req.params.id_group);

    // Vérifiez si l'utilisateur est l'admin du groupe ou un administrateur global
    if (req.user.role !== 'admin' && group.admin_id.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'User is not an admin or the admin of the group' });
    }

    // Si l'utilisateur est un admin de groupe ou un administrateur global, continuez avec la requête
    next();
};