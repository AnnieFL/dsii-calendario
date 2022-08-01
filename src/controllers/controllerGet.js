const bcrypt = require('bcrypt');
const { Users } = require('../models/Users');
const { Equipes } = require('../models/Equipes');
const { Eventos } = require('../models/Eventos');


class ControllerGet {

    async index(req, res) {
        res.render('index');
    }

    async login(req, res) {
        res.render('login');
    }

    async calendario(req, res) {


        res.render('calendario');
    }
}

module.exports = ControllerGet;
