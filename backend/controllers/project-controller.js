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
        type: req.body.type,
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
                type: doc.type,
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

const getProject = (req, res, next) => {
    Project.findOne({_id: req.body.projectId})
            .then(doc => {
                if (doc == null || typeof doc == 'undefined') {
                    let response = new ErrorResponseBuilder('There is no project with id ' + req.body.projectId)
                                        .errorCode('PC-GP-1')
                                        .errorType('DataNotFoundError')
                                        .build();
                    return res.status(404).send(response);
                }
                let updatedResponse = {
                    projectId: doc._id,
                    title: doc.title,
                    keyCode: doc.keyCode,
                    ownerName: doc.ownerName,
                    ownerId: doc.ownerId,
                    type: doc.type,
                    members: doc.members,
                    createdDate: doc.createdDate
                };
                let response = new SuccessResponseBuilder('Project fetched successfully!!!')
                                .status(200)
                                .data(updatedResponse)
                                .build();
                return res.status(200).send(response);
            })
            .catch(error => {
                console.log(error);
                logger.log(error, req, 'PC-GP-1');
                let err = new ErrorResponseBuilder().status(500).errorCode('PC-GP-1').errorType('UnknownError').build();
                return next(err);
            })
}
module.exports = {
    createProject: createProject,
    getProject: getProject
}
