const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groupController');



// Group creation endpoint
router.post('/group', async (req, res) => {
    // TODO: Implement group creation
});

// Group invitation endpoint
router.post('/group/invite', async (req, res) => {
    // TODO: Implement group invitation
});

// Accept invitation endpoint
router.post('/group/accept', async (req, res) => {
    // TODO: Implement invitation acceptance
});

// Decline invitation endpoint
router.post('/group/decline', async (req, res) => {
    // TODO: Implement invitation decline
});

// Secret Santa assignment endpoint
router.post('/group/assign', async (req, res) => {
    // TODO: Implement Secret Santa assignment
});