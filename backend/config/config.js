module.exports = {
    connectionString: `mongodb+srv://${process.env.MONGO_ATLAS_USER}:${process.env.MONGO_ATLAS_PW}@itracker-ftqm3.mongodb.net/itracker?retryWrites=true`,
    defaultProject:{
        id: 'uFOUIKMUo',
        title: 'Default'
    }
}