const express = require('express');
const router = express.Router();

const {decodeToken, checkUser} = require('../middleware/check-auth');
const validateRequest = require('../middleware/validate-request');
const projectController = require('../controllers/project-controller');

router.post('/create', decodeToken, checkUser, validateRequest('PC-CP-1', 'title', 'lead'), projectController.createProject);

module.exports = router;