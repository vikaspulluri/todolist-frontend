const User = require('../models/user-model');
const Project = require('../models/project-model');
const Feedback = require('../models/feedback-model');
const bcrypt = require('bcryptjs');
const {ErrorResponseBuilder, SuccessResponseBuilder} = require('../libraries/response-builder');
const jwt = require('jsonwebtoken');
const validateRequest = require('../libraries/validate-request');
const dateUtility = require('../libraries/date-formatter');
const logger = require('../libraries/log-message');
const mailService = require('../libraries/mail-service');
const { addMemberToDefaultProject } = require('./project-controller');

const createUser = (req, res, next) => {
  const isAdmin = (req.headers.isadmin) ? true : false;
  bcrypt.hash(req.body.password, 12)
        .then(hash => {
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            createdDate: dateUtility.formatDate(),
            hasAdminPrevilieges: isAdmin
          });
          user.save()
              .then(result => {
                let data = {
                  userId: result._id,
                  firstName: result.firstName,
                  lastName: result.lastName,
                };
                addMemberToDefaultProject(data);
                data.email = result.email;
                let response = new SuccessResponseBuilder('User created successfully!!!')
                                  .status(201)
                                  .data(data)
                                  .build();
                return res.status(201).send(response);
                })
              .catch(error => {
                logger.log(error, req, 'UC-CU');
                let err = new ErrorResponseBuilder().status(500).errorCode('UC-CU-2').errorType('UnknownError').build();
                return next(err);
              })
            })
}

const loginUser = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
          if(!user) {
            let error = new ErrorResponseBuilder('Invalid username provided')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('UC-LU-2')
                                        .build();
            return next(error);
          }
          fetchedUser = user;
          return bcrypt.compare(req.body.password, fetchedUser.password);
        })
        .then(result => {
            if(!result){
                let error = new ErrorResponseBuilder('Invalid Authentication Credentials')
                                        .status(401)
                                        .errorType('OAuthError')
                                        .errorCode('UC-LU-3')
                                        .build();
                return next(error);
            }
            const token = jwt.sign({email: fetchedUser.email, firstName: fetchedUser.firstName, lastName: fetchedUser.lastName, id: fetchedUser._id, isAdmin: fetchedUser.hasAdminPrevilieges}, process.env.JWT_KEY, {expiresIn: '2h'});
            const data = {
                token: token,
                expiryDuration: 7200,
                username: fetchedUser.firstName + ' ' + fetchedUser.lastName,
                userId: fetchedUser._id,
                loginCount: fetchedUser.loginCount
            };
            incrementLoginCount(req.body.email, req, next);
            let jsonResponse = new SuccessResponseBuilder('User Logged In Successfully...').data(data).build();
            return res.status(200).send(jsonResponse);
        })
        .catch(error => {
            logger.log(error, req, 'UC-LU');
            let err = new ErrorResponseBuilder().status(500).errorCode('UC-LU-4').errorType('UnknownError').build();
            return next(err);
        });
}

const incrementLoginCount = (email, req, next) => {
  User.findOneAndUpdate({email: email},
    {$inc: {loginCount: 1}})
    .then(docs => {
      // successfully updated
    })
    .catch(error => {
      logger.log(error, null, 'UC-ILC-1');
      let err = new ErrorResponseBuilder().status(500).errorCode('UC-UUPI-3').errorType('UnknownError').build();
      return next(err);
    })
}

const getUserStats = (req, res, next) => {
  User.findById(req.body.userId, {password: 0})
      .then(doc => {
        if (doc == null || typeof doc == 'undefined') {
          let response = new ErrorResponseBuilder('There is no user with id ' + req.body.userId)
                              .errorCode('UC-GUS-1')
                              .errorType('DataNotFoundError')
                              .build();
          return res.status(404).send(response);
        }
        return {userId: doc._id, firstName: doc.firstName, lastName: doc.lastName};
      })
      .then(userData => {
        Project.find({$or: [{ownerId: userData.userId}, {members: {$elemMatch: {userId: userData.userId}}}]})
                .then(docs => {
                  userData.projectDetails = docs.map(doc => {
                    let obj = {
                      title: doc.title,
                      projectId: doc._id
                    };
                    return obj;
                  });
                  let jsonResponse = new SuccessResponseBuilder('User Stats Fetched Successfully!!!').data(userData).build();
                  res.status(200).send(jsonResponse);
                })
                .catch(error => {
                  logger.log(error, req, 'UC-GUS');
                  let err = new ErrorResponseBuilder().status(500).errorCode('UC-GUS-3').errorType('UnknownError').build();
                  return next(err);
                })
      })
      .catch(error => {
        logger.log(error, req, 'UC-GU');
        let err = new ErrorResponseBuilder().status(500).errorCode('UC-GU-4').errorType('UnknownError').build();
        return next(err);
      })
}

const getUser = (req, res, next) => {
    User.findById(req.userData.userId)
        .exec()
        .then(result => {
            let data = {
                userId: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                createdOn: result.createdDate
            }
            let jsonResponse = new SuccessResponseBuilder('User Data Fetched Successfully!!!').data(data).build();
            res.status(200).send(jsonResponse);
        })
        .catch(error => {
            logger.log(error, req, 'UC-GU');
            let err = new ErrorResponseBuilder().status(500).errorCode('UC-GU-3').errorType('UnknownError').build();
            return next(err);
        })
}

const getAllUsers = (req, res, next) => {
  User.find({hasAdminPrevilieges: false},{firstName: 1, lastName: 1, _id: 1})
      .then(result => {
        let customResponse = result.map(user => {
          let obj = {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName
          };
          return obj;
        });
        let jsonResponse = new SuccessResponseBuilder('Users data fetched successfully!!!').data(customResponse).build();
        res.status(200).send(jsonResponse);
      })
      .catch(error => {
        logger.log(error, req, 'UC-GAU');
        let err = new ErrorResponseBuilder().status(500).errorCode('UC-GAU-1').errorType('UnknownError').build();
        return next(err);
      })
}
 
const getUserNotifications = (req, res, next) => {
  User.findOne({_id: req.userData.userId},{notifications: 1})
      .exec()
      .then(result => {
        let jsonResponse = new SuccessResponseBuilder('User notifications fetched successfully!!!').data(result.notifications).build();
        res.status(200).send(jsonResponse);
      })
      .catch(error => {
        logger.log(error, req, 'UC-GUN-1');
        let err = new ErrorResponseBuilder().status(500).errorCode('UC-GUN-1').errorType('UnknownError').build();
        return next(err);
      })
}

const sendUserFeedback = (req, res, next) => {
  const feedbackData = {
    name: req.body.userName,
    query: req.body.query,
    description: req.body.description,
    userId: req.userData.userId,
    email: req.userData.email
  };
  const feedback = new Feedback(feedbackData);
  feedback.save()
    .then(result => {
      mailService.sendFeedback(feedbackData);
      let jsonResponse = new SuccessResponseBuilder('Thanks for your time, We will reach out to you soon!!!').data().build();
      res.status(200).send(jsonResponse);
    })
    .catch(error => {
      logger.log(error, req, 'UC-SUF-2');
      let err = new ErrorResponseBuilder().status(500).errorCode('UC-SUF-2').errorType('UnknownError').build();
      return next(err);
    })
}

const updateUserPersonalInfo = (req, res, next) => {
  let reqValidity = validateRequest(req, 'firstName','lastName');
  if(reqValidity.includes(false)) {
      let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('UC-UUPI-1').build();
      return next(error);
  }
  User.findOneAndUpdate({_id: req.userData.userId},
                        {$set: {firstName: req.body.firstName, lastName: req.body.lastName}},
                        {new: true})
      .then(docs => {
        if(docs.firstName) {
          let obj = {
            firstName: docs.firstName,
            lastName: docs.lastName
          };
          let jsonResponse = new SuccessResponseBuilder('Successfully updated!!!').data(obj).build();
          res.status(200).send(jsonResponse);
        } else {
          logger.log(docs, req, 'UC-UUPI-2');
          let err = new ErrorResponseBuilder('Unable to update your details!!! Please try again later...').status(500).errorCode('UC-UUPI-3').errorType('UnknownError').build();
          return next(err);
        }

      })
      .catch(error => {
        logger.log(error, req, 'UC-UUPI-3');
        let err = new ErrorResponseBuilder().status(500).errorCode('UC-UUPI-3').errorType('UnknownError').build();
        return next(err);
      })
}

const requestUserPassword = (req, res, next) => {
  let reqValidity = validateRequest(req, 'email');
  if(reqValidity.includes(false)) {
    let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('UC-RUP-1').build();
    return next(error);
  }
  User.countDocuments({email: req.body.email})
      .exec()
      .then(docsCount => {
        if(docsCount > 0) {
          // send recovery link to provided email
          const token = jwt.sign({email: req.body.email}, process.env.JWT_KEY, {expiresIn: '1h'});
          const mailData = {
            email: req.body.email,
            verificationCode: token
          };
          mailService.sendRecoveryMail(mailData);
          let jsonResponse = new SuccessResponseBuilder('We have sent a revocery code to your registered mail. Please check your mail and follow the steps mentioned!!!').data().build();
          res.status(200).send(jsonResponse);
        } else {
          // no user found with the email provided
          let error = new ErrorResponseBuilder('No user found with the provided email Id, please check again the email provided!!!').status(404).errorType('DataNotFoundError').errorCode('UC-RUP-2').build();
          return next(error);
        }
      })
      .catch(error => {
        logger.log(error, req, 'UC-RUP-3');
        let err = new ErrorResponseBuilder().status(500).errorCode('UC-RUP-3').errorType('UnknownError').build(); 
        return next(err);
      })
}

const resetPassword = (req, res, next) => {
  let reqValidity = validateRequest(req, 'verificationCode', 'newPassword');
  if(reqValidity.includes(false)) {
    let error = new ErrorResponseBuilder('Invalid request').errorType('DataValidationError').status(400).errorCode('UC-RP-1').build();
    return next(error);
  }
  const token = `${req.body.verificationCode}`;
  let decodedToken = '';
  // jwt.verify in synchronous mode will throw error incase of invalid token
  try {
    decodedToken = jwt.verify(token, process.env.JWT_KEY);
    let email = decodedToken.email;
    bcrypt.hash(req.body.newPassword, 12)
          .then(hash => {
            User.findOneAndUpdate({email: email},{password: hash})
                .then(result => {
                  let jsonResponse = new SuccessResponseBuilder('Password updated successfully!!! Please login with your new password...').data().build();
                  res.status(200).send(jsonResponse);
                })
                .catch(err => {
                  logger.log(err, req, 'UC-RP-2');
                  let error = new ErrorResponseBuilder('Something went wrong, please try again later!!!').errorCode('UC-RP-2').errorType('UnknownError').build();
                  return next(error);
                })
          })
          .catch(err => {
            logger.log(err, req, 'UC-RP-3');
            let error = new ErrorResponseBuilder('Something went wrong, please try again later!!!').errorCode('UC-RP-3').errorType('UnknownError').build();
            return next(error);
          })
  } catch(err) {
    logger.log(err, req, 'UC-RP-4');
    let error = new ErrorResponseBuilder('Please provide correct verification code!!!').errorCode('UC-RP-4').errorType('OAuthError').build();
    return res.status(400).send(error);
  }
}

module.exports = {
  createUser: createUser,
  loginUser: loginUser,
  getUser: getUser,
  getUserStats: getUserStats,
  getAllUsers: getAllUsers,
  getUserNotifications: getUserNotifications,
  sendUserFeedback: sendUserFeedback,
  updateUserPersonalInfo: updateUserPersonalInfo,
  requestUserPassword: requestUserPassword,
  resetPassword: resetPassword
}