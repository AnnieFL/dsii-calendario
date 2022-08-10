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

    async sair(req, res) {
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

        if (req.query.erro) {
            erro = req.query.erro;
        }


        return res.render('login', { login: login, erro: erro });
    }

    async calendario(req, res) {
        if (!req.session.user) {
            return res.redirect('/')
        }
        
        const meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]

        const {id} = req.params;
        let {mes} = req.query;

        if (!mes) {
            mes = 0;
        }

        let data = new Date()
        let month = data.getMonth();
        month += 1 + parseInt(mes);
        let year = data.getFullYear();
        
        data.setDate(1);
        data.setMonth((data.getMonth()+parseInt(mes)))
        
        const usersEquipes = await UsersEquipes.findAll({
            where: {
                userId: id,
                aceito: true
            }
        })

        const userPrincipal = await Users.findOne({
            where: {
                id: id
            }
        })

        

        if (!userPrincipal) {
            res.redirect('/')
        }

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
            data.getMonth()+1,
            0
        ).getDate();

        const ultimoDiaAnterior = new Date(
            data.getFullYear(),
            data.getMonth()+1,
            0
        ).getDate();

        const primeiroDiaIndex = data.getDay();

        const ultimoDiaIndex = new Date(
            data.getFullYear(),
            data.getMonth()+1,
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
        return res.render('calendario', { user: req.session.user, dias: dias, userPrincipal: userPrincipal, mes: meses[month-1], mesQuery: mes, idParam: id, mesView: month, anoView: year });
    }


    async meuPerfil(req, res) {

        if (!req.session.user) {
            return res.redirect('/');
        }


        const usuario = await Users.findOne({
            where:{
                id: req.session.user.id
            }
        })

        if(!usuario){
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

        let user = usuario
        user.membrodata = dayjs(user.createdAt).format('DD/MM/YYYY')

        return res.render('meuperfil', { user: user, meustimes: meustimes })


    }

    async equipes(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }
        let erro = ""
        const {dono, existe, sucesso } = req.query
        console.log(dono)
        if(dono) {
            erro= "dono"
        }

        if(existe) {
            erro= "existe"
        }

        if(sucesso) {
            if(sucesso == 'true') {
                erro = 'true'
            }else{
                erro = 'false'
            }
            
        }

        const userEquipes = await UsersEquipes.findAll({
            where: {
                userId: req.session.user.id,
                aceito: true
            }
        })

        const meustimes = await Equipes.findAll({
            where: {
                id: userEquipes.map(equipe => equipe.equipeId)
            }
        })

        const equipesUser = meustimes.map(async time => {
            let time_user 

                const UserEquipe = await UsersEquipes.findAll({
                    where: {
                        equipeId: time.id,
                        aceito: true
                    }
                })

                const Usuarios = await Users.findAll({
                    where: {
                        id: UserEquipe.map(user_equipe => user_equipe.userId)
                    }
                })

                let userTime_formated = Usuarios.map(user => {
                    let data = UserEquipe.filter(user_equipe => user_equipe.userId == user.id)[0].createdAt
                    user.membrodata = dayjs(data).format('DD/MM/YYYY')
                    return user
                })
                
                time_user = { ...time, users: userTime_formated }

                return time_user
            
        })



        const resolvedValue = await Promise.all(equipesUser);
        
        console.log(erro)

        return res.render('equipes', { user: req.session.user, equipes: resolvedValue, erro: erro })
    }



    async EditarEquipe(req, res) {

        const {id} = req.params

        if(!id) {
            res.redirect('/')
        }

        if (!req.session.user) {
            return res.redirect('/');
        }

        const Equipe = await Equipes.findOne({
            where: {
                id: id
            }
        })
        

    } 


    async equipe(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }
        const { id } = req.params;

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

        return res.render('equipe', { user: req.session.user, equipe: equipe, eventos: eventos });
    }

    async addEquipe(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }
        return res.render('addequipe', { user: req.session.user, editar: false });
    }

    async evento(req, res) {
        if (!req.session.user) {
            return res.redirect('/');
        }
        const { id } = req.params;

        let {data} = req.query;
        
        if (!data) {
            data = "";
        }

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

            return res.render('evento', { user: req.session.user, equipes: equipes, evento: false, data: data })
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


        return res.render('evento', { user: req.session.user, equipe: equipe, evento: evento, data:data });

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

        if (!evento) {
            return res.redirect('/');
        }

        evento.tempo = dayjs(evento.data).format('hh:mm')
        evento.date = dayjs(evento.data).format('YYYY-MM-DD')

        req.session.equipe = evento.equipeId
        
        return res.render('addevento', {user: req.session.user, equipe: req.session.equipe, evento: evento});
    }

    async convites (req,res) {
        
        if (!req.session.user) {
            return res.redirect('/');
        }
        let resposta = ''
        const {aceito, recusado} = req.query

        console.log(req.query)

        if(aceito) {
            resposta = 'true'
        }

        if(recusado) {
            resposta = 'false'
        }


        const convites = await UsersEquipes.findAll({
            where:{
                userId: req.session.user.id,
                aceito: false
            }
        })

        const EquipesRegentes = await Equipes.findAll({
            where:{
                id: convites.map(convite => convite.equipeId)
            }
        })

        return res.render('meusconvites', {equipes: EquipesRegentes, resposta: resposta})



    }


    async convite (req,res) {
        
        if (!req.session.user) {
            return res.redirect('/');
        }

        const{ resposta, equipe} = req.query

        if(!resposta) {
            return res.redirect('/');
        }
 
        if(!equipe) {
            return res.redirect('/');
        }

        if(!Number.isInteger(parseInt(equipe))) {
            return res.redirect('/');
        }   

        if(resposta == 'true' ) {

            const convite = await UsersEquipes.findOne({
                where:{
                    equipeId: equipe,
                    userId: req.session.user.id,
                    aceito: false
                }
            })

            if(!convite) {
                return res.redirect('/');
            }

            convite.aceito = true;

            await convite.save();

            return res.redirect('/convites?aceito=true');

        }


        if(resposta == 'false') {
            
            const convite = await UsersEquipes.findOne({
                where:{
                    equipeId: equipe,
                    userId: req.session.user.id,
                    aceito: false
                }
            })

            if(!convite) {
                return res.redirect('/');
            }

            await convite.destroy();

            return res.redirect('/convites?recusado=true');

        }

        return res.redirect('/')
        

    }


    async removerEquipe (req,res) {
        
        if (!req.session.user) {
            return res.redirect('/');
        }

        const { equipe } = req.query

        if(!equipe) {
            return res.redirect('/');
        }

        if(!Number.isInteger(parseInt(equipe))) {
            return res.redirect('/');
        }   


        const meuTime = await Equipes.findOne({
            where: {
                id: equipe,
                dono: req.session.user.id
            }
        })

        if(!meuTime) {
            return res.redirect('/')
        }
     
        const ConvitesMeuTime = await UsersEquipes.findAll({
            where: {
                equipeId: meuTime.id
            }
        })

        for (const convite of ConvitesMeuTime) {
            await convite.destroy()
        }

        meuTime.destroy()
        
        return res.redirect('/equipes')

    }


    
    async sairEquipe (req,res) {
        
        if (!req.session.user) {
            return res.redirect('/');
        }

        const { equipe } = req.query

        if(!equipe) {
            return res.redirect('/');
        }

        if(!Number.isInteger(parseInt(equipe))) {
            return res.redirect('/');
        }   

        
        const Time = await Equipes.findOne({
            where: {
                id: equipe,
            }
        })

        if(Time.dono == req.session.user.id ) {
            return res.redirect(`/removerequipe?equipe=${Time.id}`);
        }

     
        const ConviteMeuTime = await UsersEquipes.findOne({
            where: {
                equipeId:equipe,
                userId: req.session.user.id
            }
        })

        ConviteMeuTime.destroy()
  
        return res.redirect('/equipes')

    }


}

module.exports = ControllerGet;
