const bcrypt = require('bcryptjs');
const { Op } = require("sequelize");
const { Users } = require("../models/Users");
const { Equipes } = require("../models/Equipes");
const { Eventos } = require("../models/Eventos");
const { Empresas } = require("../models/Empresas");
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
        const { nome, email, senha, empresaId } = req.body;


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

        if (req.body.empresa) {
            const UserId = await Users.findOne({
                where: {
                    nome: nome,
                    email: email,
                    senha: senhaEncrypt
                }
            })

            return res.render('empresa', {user: UserId.id})
        }

        await Users.update({
            empresaId: empresaId
        }, {
            where: {
                nome: nome,
                email: email,
                senha: senhaEncrypt
            }
        })

        return res.redirect('/inicio');
    }

    async addEmpresa(req, res) {
        const {userId, nome} = req.body;

        await Empresas.create({
            nome: nome,
            dono: userId
        });

        const empresaId = await Empresas.findOne({
            where: {
                nome: nome,
                dono: userId
            }
        })

        await Users.update({
            empresaId: empresaId.id
        },{
            where: {
                id: userId
            }
        })

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
            dono: req.session.user.id,
            empresaId : req.session.user.empresaId
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
            ativo: true
        })

        return res.redirect('/');
    }

    async addEvento(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }

        const { data, tempo, descricao, equipe } = req.body

        const users = await UsersEquipes.findAll({
            where: {
                equipeId: equipe
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
                data: `${data} ${tempo}`
            }
        })

        if (eventoCheck[0]) {
            return res.redirect('/inicio?erro=erroEvento')
        }

        await Eventos.create({
            data: `${data} ${tempo}`,
            descricao: descricao,
            equipeId: equipe
        })

        req.session.equipe = null;

        res.redirect('/');
    }

    async editEvento(req, res) {
        if (!req.session.user || !req.session.equipe) {
            return res.redirect('/');
        }

        const { data, tempo, descricao, id } = req.body

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
                data: `${data} ${tempo}`,
                [Op.not]: { id: id }
            }
        })

        if (eventoCheck[0]) {
            return res.redirect('/inicio?erro=erroEvento')
        }

        await Eventos.update({
            data: `${data} ${tempo}`,
            descricao: descricao
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
