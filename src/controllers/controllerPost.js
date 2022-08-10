const bcrypt = require('bcryptjs');
const { Users } = require("../models/Users");
const { Equipes } = require("../models/Equipes");
const { Eventos } = require("../models/Eventos");
const { Op } = require("sequelize");
const fs = require('fs').promises
const { Empresas } = require("../models/Empresas");
const { EquipesEmpresas } = require("../models/EquipesEmpresas");
const { UsersEquipes } = require("../models/UsersEquipes");


class ControllerPost {
    async login(req, res) {
        const { email, senha } = req.body;

        const conta = await Users.findOne({
            where: {
                email: email,
            }
        })

        if (!conta) {

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
        const { nome, email, senha } = req.body;


        if (email == undefined || email == "" || email.includes("@") == false) {
            return res.redirect('/login?cadastro&erro=email');
        }

        if (nome == undefined || nome == "") {
            return res.redirect('/login?cadastro&erro=nome');
        }

        if (senha == "" || senha == undefined) {
            return res.redirect('/login?cadastro&erro=senha');
        }

        const senhaEncrypt = bcrypt.hashSync(senha, 10);

        const VerificarConta = await Users.findOne({
            where: {
                email: email,
            }
        })

        if (VerificarConta) {
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


        if (nome == '' || nome == undefined) {
            return res.redirect('/addequipe')
        }

        if (cor == '' || cor == undefined) {
            return res.redirect('/addequipe')
        }

        await Equipes.create({
            nome: nome,
            cor: cor,
            dono: req.session.user.id
        })

        const equipe = await Equipes.findOne({
            where: {
                nome: nome,
                cor: cor,
                dono: req.session.user.id,
            }
        })

        await UsersEquipes.create({
            userId: req.session.user.id,
            equipeId: equipe.id,
            aceito: true
        })

        return res.redirect('/equipes');
    }

    async addEvento(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }

        const { data, descricao, periodo, equipe } = req.body

        await Eventos.create({
            data: data,
            descricao: descricao,
            periodo: periodo,
            equipeId: equipe
        })

        req.session.equipe = null;

        res.redirect('/');
    }

    async addMembro(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }

        const { grupo, email } = req.body

        if (!grupo || grupo == 0) {
            return res.redirect('/equipes')
        }

        if (!email || email == "") {
            return res.redirect('/equipes')
        }



        const user = await Users.findOne({
            where: {
                email: email,
            }
        })


        if (!user) {
            return res.redirect('/equipes?sucesso=false')
        }

        if (req.session.user.id == user.id) {
            return res.redirect('/equipes?dono=true')
        }

        const convite = await UsersEquipes.findOne({
            where: {
                userId: user.id,
                equipeId: grupo,
            }
        })

        if (convite) {
            return res.redirect('/equipes?existe=true')
        }

        await UsersEquipes.create({
            userId: user.id,
            equipeId: grupo,
            aceito: false
        })

        return res.redirect('/equipes?sucesso=true')


    }

    async changefoto(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }
        const {img} = req.body
        if(img == '' || !img ) {
            return  res.redirect('/')
        }

        const user = await Users.findOne({
            where: {
               id: req.session.user.id
            }
        })

        if(!user) {
            return  res.redirect('/')
        }

        user.foto = img

        await user.save();

        return  res.redirect('/meuperfil')
    }

    async editEvento(req, res) {
        if (!req.session.user || !req.session.equipe) {
            return res.redirect('/');
        }

        const { data, periodo, descricao, id } = req.body

        const users = await UsersEquipes.findAll({
            where: {
                equipeId: req.session.equipe
            }
        })


        const usersId = users.map((e) => (
            e.userId
        ))


        const equipes = await UsersEquipes.findAll({
            where: {
                userId: usersId
            }
        })


        const equipesId = equipes.map((e) => (
            e.equipeId
        ))

        const eventoCheck = await Eventos.findAll({
            where: {
                equipeId: equipesId,
                data: data,
                periodo: periodo,
                [Op.not]: { id: id }
            }
        })

        if (eventoCheck[0]) {
            return res.redirect('/inicio?erro=erroEvento')
        }

        await Eventos.update({
            data: data,
            descricao: descricao,
            periodo: periodo
        },
            {
                where: {
                    id: id
                }
            })

        req.session.equipe = null;

        res.redirect('/');
    }


}

module.exports = ControllerPost;
