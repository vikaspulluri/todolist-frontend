const mongoose = require('mongoose');
const shortId = require('shortid');

const issueSchema = mongoose.Schema({
    _id: {type: String, unique: true, required: true, default: shortId.generate},
    title: {type: String, required: true, trim: true},
    description: {type: String, required: true, trim: true},
    priority: {type: String, required: true},
    issueType: {type: String, required: true, default: 'Task'},
    attachment: {type: String, required: false},
    createdDate: {type: Date, default: Date.now, required: false},
    status: {type: String, default: 'backlog', required: true},
    project: {
        projectId: {type: String, required: true},
        title: {type: String, required: true}
    },
    lastModifiedOn: {type: Date, required: false},
    watchers: [{
      userId: {type:String, required: true},
      firstName: {type: String, required: true},
      lastName: {type: String, required: true}
    }],
    assignee: {
        userId: {type:String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    reporter: {
        userId: {type:String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true}
    },
    labels: [{type: String}],
    activity: [{
        summary: {type: String, required: true},
        dateLog: {type: String, require: true}
    }]
});

module.exports = mongoose.model('Issue', issueSchema);

