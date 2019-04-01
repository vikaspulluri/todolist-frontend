const express = require('express');
const router = express.Router();

const {decodeToken, checkUser} = require('../middleware/check-auth');
const validateRequest = require('../middleware/validate-request');
const issueController = require('../controllers/issue-controller');
const extractFile = require('../middleware/file');


router.post('/create', decodeToken,
                        checkUser,
                        extractFile.single('attachment'),
                        validateRequest('IC-CI', 'title', 'description', 'assignee',
                                        'reporter', 'priority'),
                        issueController.createIssue);

router.post('/id', decodeToken,
                    checkUser,
                    validateRequest('IC-GIBI-1', 'issueId'),
                    issueController.getIssueById)

router.post('/all', decodeToken,
                    checkUser,
                    issueController.constructQueryForIssues,
                    issueController.getIssues)

router.get('/labels', decodeToken, checkUser, issueController.getAvailableLabels);

module.exports = router;