const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/Paciente')
const Paciente = mongoose.model('pacientes')


router.get('/', (req, res) => {
    res.render('cruds/index')
})

router.get('/pacientes', (req, res) => {
    res.send('oi')
})

router.get('/pacientes/add', (req, res) => {
    res.render('cruds/addpaciente')
})

router.post('/pacientes/new', (req, res) => {

    var erros = []    //declara um array
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){       // ! == se não foi enviado
        erros.push({texto: 'Nome inválido'})                                                                  // || == ou todo array tem o push serve pra por novo dado dentro do array
    }

    if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null){
        erros.push({texto: 'Endereço inválido'})
    }

    if(!req.body.cartao || typeof req.body.cartao == undefined || req.body.cartao == null){
        erros.push({texto: 'Id de cartão inválido'})
    }

    if(req.body.cartao.length < 9 || req.body.cartao.length > 9){
        erros.push({texto: 'O id precisa ter 9 digitos'})
    }

    if(erros.length > 0){  // se o tamnho do array for maior do q 0 pq a cada erro o array vazio recebe um item
        res.render('cruds/addpaciente', {erros: erros})  // da pra passar dados para view através do render
    }else{
        const novoPaciente = {
        nome: req.body.nome,
        endereco: req.body.endereco,
        cartao: req.body.cartao
        }

        new Paciente(novoPaciente).save().then(() => {
            req.flash('msg_success', 'Paciente resgistrado!')
            res.redirect('/')
        }).catch((err) => {
            req.flash('msg_error', 'Erro ao registrar')
            res.redirect('/')
        })
    }
})

router.get('/pacientes/edit/:id', (req, res) => {
    Paciente.findOne({_id:req.params.id}).lean().then((paciente) => {
        res.render('cruds/editpaciente', {paciente: paciente})
    }).catch((err) => {
        req.flash('msg_error', 'Paciente inexistente' +err)
        res.redirect('/')
    })
    
})

router.get('/pacientes/:id', (req, res) => {
    Paciente.findOne({_id: req.params.id}).lean().then((paciente) => {
        res.render('cruds/viewpaciente', {paciente: paciente})
    }).catch((err) => {
        req.flash('msg_error', 'Paciente inexistente' +err)
        res.redirect('/')
    })
})

router.post('/pacientes/edit', (req, res) => {
    var erros = []    //declara um array
    
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null ){       // ! == se não foi enviado
        erros.push({texto: 'Nome inválido'})                                                                  // || == ou todo array tem o push serve pra por novo dado dentro do array
    }

    if(!req.body.endereco || typeof req.body.endereco == undefined || req.body.endereco == null){
        erros.push({texto: 'Slug inválido'})
    }

    if(!req.body.cartao || typeof req.body.cartao == undefined || req.body.cartao == null){
        erros.push({texto: 'Id de cartão inválido'})
    }

    if(req.body.cartao.length < 9 || req.body.cartao.length > 9){
        erros.push({texto: 'O id precisa ter 9 digitos'})
    }

    if(erros.length > 0){  // se o tamnho do array for maior do q 0 pq a cada erro o array vazio recebe um item
       res.render('/', {erros: erros})
    }else{
        Paciente.findOne({_id: req.body.id}).then((paciente) => {
            req.flash('msg_success', 'salvo ')
            
            paciente.nome = req.body.nome
            paciente.endereco = req.body.endereco
            paciente.cartao = req.body.cartao

            paciente.save().then(() => {
                req.flash('msg_success', ' Paciente editado com sucesso!')
                res.redirect('/')
            }).catch(() => {
                req.flash('msg_success', 'Erro ao salvar a edição do paciente')
                res.redirect('/')
            })
        }).catch((err) => {
            req.flash('msg_error', 'Erro ao editar paciente' +err)
            res.redirect('/')
        })
    }
})

router.post('/pacientes/delet', (req, res) => {
    Paciente.remove({_id: req.body.id}).then(() => {
        req.flash('msg_success', 'Paciente deletado com sucesso')
        res.redirect('/')
    }).catch((err) => {
        req.flash('msg_error', 'Erro ao excluir paciente '+err)
        res.redirect('/')
    })
})

module.exports = router