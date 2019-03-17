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
            {name: '--None--', value: 'none'},
            {name: 'Project-1', value: 'project-1'}
        ]
    }
};
