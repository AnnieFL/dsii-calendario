const bcrypt = require('bcryptjs');
const { Users } = require("../models/Users");
const { Equipes } = require("../models/Equipes");
const { Eventos } = require("../models/Eventos");
const { Empresas } = require("../models/Empresas");
const { EquipesEmpresas } = require("../models/EquipesEmpresas");
const { UsersEquipes } = require("../models/UsersEquipes");


class ControllerGet {

    async index(req, res) {
        if (!req.session.user) {
            return res.redirect('/')
        }
        return res.render('index', { user: req.session.user });
    }

    async sair(req,res) {
        req.session.user = null;
        req.session.equipe = null;
        
        return res.redirect('/')
       
    }

    async login(req, res) {
       
        if (req.session.user) {
            return res.redirect('/inicio')
        }

        let login = true;
        let erro = "";
        if (req.query.cadastro == '') {
            login = false;
        }

        if(req.query.erro) {
            erro = req.query.erro;
        }


        return res.render('login', { login: login, erro: erro });
    }

    async calendario(req, res) {
/*        if (!req.session.user) {
            return res.redirect('/')
        }*/
        
        let data = new Date()
        let month = data.getMonth();
        month += 1;
        let year = data.getFullYear();
        
        data.setDate(1);

        const eventos = await Eventos.findAll();

        //AINDA TENTANDO COLOCAR OS EVENTOS NO CALENDARIO
        const eventosDias = eventos.filter((e) => { e.data.toString('MM-yyyy') == `${month}-${year}`});

        const ultimoDia = new Date(
            data.getFullYear(),
            data.getMonth() + 1,
            0
        ).getDate();

        const ultimoDiaAnterior = new Date(
            data.getFullYear(),
            data.getMonth(),
            0
        ).getDate();

        const primeiroDiaIndex = data.getDay();

        const ultimoDiaIndex = new Date(
            data.getFullYear(),
            data.getMonth() + 1,
            0
        ).getDay();

        const proximosDias = 7 - ultimoDiaIndex - 1;

        const dias = [];

        for (let x = primeiroDiaIndex; x > 0; x--) {
            dias.push({
                dia: ultimoDiaAnterior - x + 1,
                class: 'mesPassado'
            });
        }

        for (let i = 1; i <= ultimoDia; i++) {
            if (
                i === new Date().getDate() &&
                data.getMonth() === new Date().getMonth()
            ) {
                dias.push({
                    dia: i,
                    class: 'hoje'
                });
            } else {
                dias.push({
                    dia: i,
                    class: 'mesAtual'
                });
            }
        }

        for (let j = 1; j <= proximosDias; j++) {
            dias.push({
                dia: j,
                class: 'mesSeguinte'
            });
        }



        return res.render('calendario', { user: req.session.user, dias: dias });
    }

    async equipes(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }

        const userEquipes = await UsersEquipes.findAll({
            where: {
                userId: req.session.user.id
            }
        })


        const equipes = [];

        for (let i=0; i<userEquipes.length; i++) {
            const equipe = await Equipes.findOne({
                where: {
                    id: userEquipes[i].equipeId
                }
            })

            equipes.push(equipe)
        }

        return res.render('equipes', { user: req.session.user, equipes: equipes })
    }



    
    async equipe(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }
        const {id} = req.params;
        
        const equipe = await Equipes.findOne({
            where: {
                id: id
            }
        })
        
        req.session.equipe = equipe;
        
        const eventos = await Eventos.findAll({
            where: {
                equipeId: id
            }
        })

        return res.render('equipe', { user: req.session.user, equipe : equipe, eventos: eventos });
    }

    async addEquipe(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }
        return res.render('addequipe', { user: req.session.user });
    }

    async evento(req, res) {
        if (!req.session.user || !req.session.equipe) {
            return res.redirect('/');
        }
        const {id} = req.params;
        if (id == 0) {
            return res.render('evento', {user: req.session.user, equipe: req.session.equipe, evento: false})
        }

        const evento = await Eventos.findOne({
            where: {
                id: id
            }
        })

        
        const equipe = await Equipes.findOne({
            where: {
                id: evento.equipeId
            }
        })
        
        
        return res.render('evento', { user: req.session.user, equipe: equipe, evento: evento });

    }

    async addEvento(req, res) {
        if (!req.session.user || !req.session.equipe) {
            return res.redirect('/');
        }
        const {id} = req.params;

        const evento = await Eventos.findOne({
            where: {
                id: id
            }
        })

        return res.render('addevento', {user: req.session.user, equipe: req.session.equipe, evento: evento});
    }
}

module.exports = ControllerGet;
