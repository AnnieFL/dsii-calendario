const bcrypt = require('bcrypt');
const { Users } = require('../models/Users');
const { Equipes } = require('../models/Equipes');
const { Eventos } = require('../models/Eventos');


class ControllerPost {
    async login(req, res) {
        console.log(req.body)
    }
}

module.exports = ControllerPost;
