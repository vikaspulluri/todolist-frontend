export const config = {
    filtersForm: {
        userGroup: [
            {name: 'All', value: 'all'}
        ],
        issueGroup: [
            {name: 'All', value: null},
            {name: 'Open', value: 'open'},
            {name: 'Todo', value: 'todo'},
            {name: 'In Progress', value: 'in-progress'},
            {name: 'Completed', value: 'done'}
        ],
        priorityGroup: [
            {name: 'All', value: null},
            {name: 'High', value: 'high'},
            {name: 'Medium', value: 'medium'},
            {name: 'Low', value: 'low'}
        ],
        projectGroup: [
            {name: 'Default', value: 'default'},
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
    projectTypes: ['Software Development', 'Website Development', 'QA', 'Deployment', 'None'],
    customPagination: {
        itemsPerPage: 2,
        currentPage: 1,
        itemsPerPageOptions: [2, 3, 5, 8, 10]
    }
};
