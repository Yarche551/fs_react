const config = {
    secret: process.env.SECRET || '23rfewwef2f3deASFf9iwgefjqifdWA',
    env: process.env.ENV,
    port: process.env.PORT || 3000,
    db: {
        dbUrl: process.env.DB_URL || 'mongodb://127.0.0.1:27017',
        dbName: process.env.DB_NAME || 'freelancers',
        dbHost: 'localhost',
        dbPort: 27017,
    },
    orderStatuses: {
        new: 'new',
        confirmed: 'confirmed',
        success: 'success',
        canceled: 'canceled',
    },
    freelancerLevels: {
        junior: 'junior',
        middle: 'middle',
        senior: 'senior',
    },
    freelancerAvatarsPath: '/images/freelancers/avatars/',
    defaultFreelancerAvatar: '/images/freelancers/avatar-stub.png',
};

module.exports = config;