const bcrypt = require('bcryptjs');
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

        if(!conta) {

            return res.redirect('/')

        }

        const confere = bcrypt.compareSync(senha, conta.senha);
        if (confere) {
            req.session.user = conta;
            return res.redirect('/inicio')
        } else {
            return res.redirect('/login?erro=errologin');
        }
    }

    async cadastro(req, res) {
        const {nome, email, senha} = req.body;
        

        if(email == undefined || email == ""  || email.includes("@") == false) {
            return res.redirect('/login?cadastro&erro=email');
        }

        if(nome == undefined || nome == "") {
            return res.redirect('/login?cadastro&erro=nome');
        }

        if(senha == "" || senha == undefined) {
            return res.redirect('/login?cadastro&erro=senha');
        }

        const senhaEncrypt = bcrypt.hashSync(senha, 10); 

        const VerificarConta = await Users.findOne({
            where: {
                email: email,
            }
        })

        if(VerificarConta) {
            return res.redirect('/login?cadastro&erro=jaexiste');
        }

        await Users.create({
            nome: nome,
            email: email,
            senha: senhaEncrypt
        })

        const conta = await Users.findOne({
            where: {
                email: email,
            }
        })

        req.session.user = conta;

        return res.redirect('/inicio');
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
