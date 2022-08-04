const bcrypt = require('bcrypt');
const { Users } = require("../models/Users");
const { Equipes } = require("../models/Equipes");
const { Eventos } = require("../models/Eventos");
const { Empresas } = require("../models/Empresas");
const { EquipesEmpresas } = require("../models/EquipesEmpresas");
const { UsersEquipes } = require("../models/UsersEquipes");


class ControllerPost {
    async login(req, res) {
        const {email, senha} = req.body;

        const conta = await Users.findOne({
            where: {
                email: email,
            }
        })
        req.session.user = conta;

        return res.redirect('/')
    }

    async cadastro(req, res) {
        const {nome, email, senha} = req.body;
        
        await Users.create({
            nome: nome,
            email: email,
            senha: senha
        })

        const conta = await Users.findOne({
            where: {
                email: email,
            }
        })
        req.session.user = conta;

        return res.redirect('/');
    }

    async addEquipe(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }

        const { nome, cor } = req.body;

        await Equipes.create({
            nome: nome,
            cor: cor,
            dono: req.session.user.id 
        })

        const equipe = await Equipes.findOne({
            where: {
                nome: nome,
                cor: cor,
                dono: req.session.user.id
            }
        })

        await UsersEquipes.create({
            userId: req.session.user.id,
            equipeId: equipe.id,
        })

        return res.redirect('/');
    }
}

module.exports = ControllerPost;
