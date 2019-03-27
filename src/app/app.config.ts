export const config = {
    filtersForm: {
        userGroup: [
            {name: 'All', value: 'all'},
            {name: 'Assigned To Me', value: 'to-me'},
            {name: 'Reported By Me', value: 'from-me'}
        ],
        issueGroup: [
            {name: 'All', value: 'all'},
            {name: 'Open', value: 'open'},
            {name: 'Todo', value: 'todo'},
            {name: 'In Progress', value: 'in-progress'},
            {name: 'Completed', value: 'done'}
        ],
        priorityGroup: [
            {name: 'All', value: 'all'},
            {name: 'High', value: 'high'},
            {name: 'Medium', value: 'medium'},
            {name: 'Low', value: 'low'}
        ],
        projectGroup: [
            {name: 'General', value: 'general'},
            {name: 'Project-1', value: 'project-1'}
        ],
        labelGroup: [
            {name: '--None--', value: null}
        ]
    },
    contactUsForm: {
        queryGroup: [
            {name: 'Suggestion', value: 'suggestion'},
            {name: 'Problem with application', value: 'problem'},
            {name: 'Want to know something?', value: 'query'}
        ]
    },
    greetings: ['morning', 'afternoon', 'evening'],
    projectTypes: ['Software Development', 'Website Development', 'QA', 'Deployment', 'None']
};
