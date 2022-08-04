const { Sequelize } = require('sequelize');

const sequelizeCon = new Sequelize('postgres://asywapbwldqgtq:7e02c35875e9c1c69c0035b1be876bc9f740c8984c943b6a928377ce2e52a7f4@ec2-3-224-184-9.compute-1.amazonaws.com:5432/dflu62rimrdj9m', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

module.exports = { sequelizeCon };