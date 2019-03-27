const express = require('express');
const router = express.Router();

const {decodeToken, checkUser} = require('../middleware/check-auth');
const validateRequest = require('../middleware/validate-request');
const projectController = require('../controllers/project-controller');

router.post('/create', decodeToken, checkUser, validateRequest('PC-CP-1', 'title', 'keyCode', 'ownerName', 'ownerId', 'type'), projectController.createProject);
router.post('/id', decodeToken, checkUser, validateRequest('PC-GP-1', 'projectId'), projectController.getProject);

module.exports = router;