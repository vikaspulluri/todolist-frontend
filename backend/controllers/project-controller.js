const Project = require('../models/project-model');
const User = require('../models/user-model');
const {ErrorResponseBuilder, SuccessResponseBuilder} = require('../libraries/response-builder');
const dateUtility = require('../libraries/date-formatter');
const logger = require('../libraries/log-message');
const config = require('../config/config');

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
            let response = new SuccessResponseBuilder('Project created successfully!!!')
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
                logger.log(error, req, 'PC-GP-1');
                let err = new ErrorResponseBuilder().status(500).errorCode('PC-GP-1').errorType('UnknownError').build();
                return next(err);
            })
}
const constructQueryForGetProjects = (req, res, next) => {
    let query = {};
    $or = [];
    $or.push({title: config.defaultProject.title, _id: config.defaultProject.id }); // always return default project
    if (req.body.title && req.body.title !== '') {
        query.$and = [];
        query.$and.push({title: new RegExp(req.body.title, 'gi')}); // get projects that matches the search string
    }
    let isAllUsers = req.body.users.find(user => user === '*');
    if (isAllUsers || req.body.users === []) {
        // need to get all user ID's
        getAllUserIds().then(users => {
            req.body.users = users;
            $or.push({ownerId: {$in:users}},
                {members: {$elemMatch: {userId: {$in: users}}}});
            if (query.$and) {
                query.$and.push({$or: $or});
            } else {
                query.$or = $or;
            }
            req.projectsQuery = query;
            return next();
        })
        .catch(error => {
            logger.log(error, req, 'PC-CQFGP');
            let err = new ErrorResponseBuilder().status(500).errorCode('UC-CFGP-1').errorType('UnknownError').build();
            return next(err);
        })
    } else {
        $or.push({ownerId: {$in: req.body.users}},
            {members: {$elemMatch: {userId: {$in: req.body.users}}}});
        if (query.$and) {
            query.$and.push({$or: $or});
        } else {
            query.$or = $or;
        }
        req.projectsQuery = query;
        return next();
    }
}

const getProjects = (req, res, next) => {
    Project.find(req.projectsQuery)
            .then(docs => {
                let priorityProjects = [];
                let nonPriorityProjects = [];
                docs.forEach(doc => {
                    let updatedResponse = {
                        projectId: doc._id,
                        title: doc.title,
                        keyCode: doc.keyCode,
                        ownerName: doc.ownerName,
                        ownerId: doc.ownerId,
                        type: doc.type,
                        createdDate: doc.createdDate
                    };
                    if (doc._id === config.defaultProject.id) {
                        priorityProjects.push(updatedResponse);
                    } else {
                        nonPriorityProjects.push(updatedResponse);
                    }
                });
                let response = [...priorityProjects, ...nonPriorityProjects];
                let jsonResponse = new SuccessResponseBuilder('User Projects Fetched Successfully!!!').data(response).build();
                res.status(200).send(jsonResponse);
            })
            .catch(error => {
                logger.log(error, req, 'PC-GUS');
                let err = new ErrorResponseBuilder().status(500).errorCode('UC-GUS-3').errorType('UnknownError').build();
                return next(err);
            })
}

const getAllUserIds = () => {
    return new Promise((resolve, reject) => {
        User.find({}, {_id: 1})
            .then(users => {
                let userIds = users.map(user => user._id);
                resolve(userIds);
            })
            .catch(error => {
                logger.log(error, '*', 'PC-GAUI');
                reject(error);
            })
    });
}

const addMemberToDefaultProject = (user) => {
    return new Promise((resolve, reject) => {
        Project.findOneAndUpdate({_id: config.defaultProject.id},
            {$push: {members: user}})
            .then(doc => resolve(true))
            .catch(error => {
                logger.log(error, '*', 'PC-AMTDP');
                reject(false);
            });
    });                 
}

module.exports = {
    createProject: createProject,
    getProject: getProject,
    getProjects: getProjects,
    constructQueryForGetProjects: constructQueryForGetProjects,
    addMemberToDefaultProject: addMemberToDefaultProject
}
