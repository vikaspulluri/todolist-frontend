const Project = require('../models/project-model');
const {ErrorResponseBuilder, SuccessResponseBuilder} = require('../libraries/response-builder');
const validateRequest = require('../libraries/validate-request');
const dateUtility = require('../libraries/date-formatter');
const logger = require('../libraries/log-message');

const createProject = (req, res, next) => {
    const project = {
        title: req.body.title,
        keyCode: req.body.keyCode,
        ownerName: req.body.ownerName,
        ownerId: req.body.ownerId,
        createdDate: dateUtility.formatDate(),
        isGloballyAvailable: req.body.isGloballyAvailable || false,
        members: req.body.members || []
    };
    new Project(project).save()
        .then(doc => {
            const projectData = {
                title: doc.title,
                keyCode: doc.keyCode,
                ownerId: doc.ownerId,
                ownerName: doc.ownerName,
                members: doc.members,
                createdDate: doc.createdDate,
                projectId: doc._id
            }
            let response = new SuccessResponseBuilder('User created successfully!!!')
                                .status(201)
                                .data(projectData)
                                .build();
            return res.status(201).send(response);
        })
        .catch(error => {
            logger.log(error, req, 'PC-CP-1');
            let err = new ErrorResponseBuilder().status(500).errorCode('PC-CP-1').errorType('UnknownError').build();
            return next(err);
        })
}

module.exports = {
    createProject: createProject
}
