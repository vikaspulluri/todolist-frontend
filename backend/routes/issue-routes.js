const express = require('express');
const router = express.Router();

const {decodeToken, checkUser} = require('../middleware/check-auth');
const validateRequest = require('../middleware/validate-request');
const issueController = require('../controllers/issue-controller');
const extractFile = require('../middleware/file');


router.post('/create', decodeToken,
                        checkUser,
                        validateRequest('IC-CI-1', 'title', 'description', 'project', 'priority', 'assignee', 'reporter'),
                        extractFile.single('attachment'),
                        issueController.createIssue);

router.post('/id', decodeToken,
                    checkUser,
                    validateRequest('IC-GIBI-1', 'issueId'),
                    issueController.getIssueById)

module.exports = router;