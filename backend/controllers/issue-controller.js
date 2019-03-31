const Project = require('../models/project-model');
const Issue = require('../models/issue-model');
const {ErrorResponseBuilder, SuccessResponseBuilder} = require('../libraries/response-builder');
const { parseJSON } = require('../libraries/parse-json');
const dateUtility = require('../libraries/date-formatter');
const logger = require('../libraries/log-message');

const createIssue = (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    // since we receive data in formData format, parse the JSON string into objects
    const project = parseJSON(project);
    const assignee = parseJSON(assignee);
    const reporter = parseJSON(reporter);
    if (!(project && assignee && reporter)) {
        logger.log({name: 'Invalid format for project, assignee, reporter'}, req, 'IC-CI-1');
        let err = new ErrorResponseBuilder('Invalid format for project, assignee, reporter').status(400).errorCode('IC-CI-1').errorType('DataValidationError').build();
        return next(err);
    }
    const issue = {
        title: req.body.title,
        description: req.body.description,
        issueType: req.body.issueType,
        priority: req.body.priority,
        project: project,
        assignee: assignee,
        reporter: reporter,
        createdDate: dateUtility.formatDate()
    };
    if (req.body.watchers && parseJSON(req.body.watchers)) {
        issue.watchers = parseJSON(req.body.watchers);
    }
    if (req.body.labels && parseJSON(req.body.labels)) {
        issue.labels = parseJSON(req.body.labels);
    }

    if (req.file && req.file.filename) {
        issue.attachment = url + '/images/' + req.file.filename;
    }
    const issueModel = new Issue(issue);
    issueModel.save()
            .then(doc => {
                let response = new SuccessResponseBuilder('Issue created successfully!!!')
                            .status(201)
                            .data({issueId: doc._id})
                            .build();
                return res.status(201).send(response);
            })
            .catch(error => {
                logger.log(error, req, 'IC-CI-2');
                let err = new ErrorResponseBuilder().status(500).errorCode('IC-CI-2').errorType('UnknownError').build();
                return next(err);
            })
}

const getIssueById = (req, res, next) => {
    Issue.findById(req.body.issueId)
        .exec()
        .then(doc => {
            if (!doc || !doc._id) {
                logger.log({name: 'No match found'}, req, 'IC-GIBI-1');
                let err = new ErrorResponseBuilder('No Issue Found with given Id').status(404).errorCode('IC-CGIBI-1').errorType('DataNotFoundError').build();
                return next(err);
            }
            let response = {
                issueId: doc._id,
                title: doc.title,
                description: doc.description,
                priority: doc.priority,
                issueType: doc.issueType,
                assignee: doc.assignee,
                reporter: doc.reporter,
                project: doc.project,
                status: doc.status,
                imageUrl: doc.attachment,
                watchers: doc.watchers,
                labels: doc.labels
            };
            let response = new SuccessResponseBuilder('Issue fetched successfully!!!')
                            .status(200)
                            .data(response)
                            .build();
            return res.status(200).send(response);
        })
}
module.exports = {
    createIssue: createIssue,
    getIssueById: getIssueById
}