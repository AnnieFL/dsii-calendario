const bcrypt = require('bcryptjs');
const dayjs = require('dayjs');

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
        if (!req.session.user) {
            return res.redirect('/')
        }
        
        let data = new Date()
        let month = data.getMonth();
        month += 1;
        let year = data.getFullYear();
        
        data.setDate(1);
        
        const usersEquipes = await UsersEquipes.findAll({
            where: {
                userId: req.session.user.id,
                aceito: true
            }
        })

        const equipesId = usersEquipes.map((e) => e.equipeId)

        const equipes = await Equipes.findAll({
            where: {
                id: equipesId
            }
        })
        
        const eventos = await Eventos.findAll({
            where: {
                equipeId: equipesId
            }
        });

        const evento_estruturado = eventos.map ( evento => {

            let equipe = equipes.filter(elemento => elemento.id == evento.equipeId)[0]
            if(equipe) {
                let evento_ajustado = {...evento, cor: equipe.cor}
                return evento_ajustado
            }
            
        })
        
        const eventosDias = evento_estruturado.filter((e) => ( dayjs(e.dataValues.data).format('MM-YYYY') == dayjs(data).format('MM-YYYY')));
        
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

        let dias = [];

        let diaEvento = [];

        for (let x = primeiroDiaIndex; x > 0; x--) {
            dias.push({
                dia: ultimoDiaAnterior - x + 1,
                class: 'mesPassado'
            });
        }

        for (let i = 1; i <= ultimoDia; i++) {
            if (i === new Date().getDate() && data.getMonth() === new Date().getMonth()) {
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

            
            diaEvento = eventosDias.filter((e) => (dayjs(e.dataValues.data).format('DD') == i));
            if (diaEvento[0]) {
                dias[dias.length-1] = {...dias[dias.length-1], evento: diaEvento[0]}
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

    async meuPerfil(req, res) {

        if (!req.session.user) {
            return res.redirect('/');
        }

        const times = await Equipes.findAll({
            where: {
                dono: req.session.user.id,
            }
        })

        const minhasSolitacoes = await UsersEquipes.findAll({
            where: {
                aceito: true
            }
        })

        const meustimes = minhasSolitacoes.map(solitacao => {

            let times_existentes = times.filter(time => time.id == solitacao.equipeId)[0]

            if (times_existentes) {
                return times_existentes
            }

        })




        console.log(req.session.user)
        console.log(meustimes)


        return res.render('meuperfil', { user: req.session.user, meustimes: meustimes })


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
        if (!req.session.user) {
            return res.redirect('/');
        }
        const {id} = req.params;

        
        if (id == 0) {
            const usersEquipes = await UsersEquipes.findAll({
                where: {
                    userId: req.session.user.id
                }
            })

            const equipesId = usersEquipes.map((e) => e.equipeId);

            const equipes = await Equipes.findAll({
                where: {
                    id: equipesId
                }
            })

            return res.render('evento', {user: req.session.user, equipes: equipes, evento: false})
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
        if (!req.session.user) {
            return res.redirect('/');
        }
        const {id} = req.params;

        const evento = await Eventos.findOne({
            where: {
                id: id
            }
        })

        req.session.equipe = evento.equipeId
        
        return res.render('addevento', {user: req.session.user, equipe: req.session.equipe, evento: evento});
    }
}

module.exports = ControllerGet;
