const { Sequelize } = require('sequelize');

const sequelizeCon = new Sequelize('postgres://dikxoiruamwazv:34618e213c31de3c6d8500ded05946c41a841ac15b5b94875a0e5f2d047a85ec@ec2-54-208-104-27.compute-1.amazonaws.com:5432/d3sh3mkops30vg', {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
});

module.exports = { sequelizeCon };