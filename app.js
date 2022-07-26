const express = require('express')
const app = express()
const mongoose = require("mongoose")
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const crud = require('./routes/crud')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require('./models/Paciente')
const Paciente = mongoose.model('pacientes')
const moment = require('moment')
const { json } = require('body-parser')
const swaggerUI = require('swagger-ui-express')
const swaggerDocumento = require('./Swagger.json')

// Configs
//Session
app.use(session({
    secret: 'desafio',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())
app.use(express.urlencoded({extended:true}))
// Middleware
app.use((req, res, next) =>{
    res.locals.msg_success = req.flash('msg_success')
    res.locals.msg_error = req.flash('msg_error')
    next() 
})
app.use(express.json())
// handlebars
app.engine('handlebars', handlebars.engine({defaultLayout: 'main', helpers:{
    FormData: (date) =>{
        return moment(date).format('DD/MM/YYYY')
    }
}}))
app.set('view engine', 'handlebars')
//Conexão com o Banco
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/desafio').then(() => {
    console.log('conetado ao servidor')
}).catch((err) => {
    console.log('Erro na conexão: '+err)
})

//Estaticos
app.use(express.static(path.join(__dirname+'/public')))

//Rotas

app.get('/' ,(req, res) => {
    Paciente.find().lean().then((pacientes) => {
        res.render('cruds/pacientes', {pacientes: pacientes})
    }).catch((err) => {
        req.flash('msg_errro', 'Erro ao listar '+err)
        res.redirect('/')
    })
    
})

app.post('/exemplo', (req, res) => {
    res.json({
        "id": "0939db71-c518-4c6c-bb48-e36347722db1",  // patient id 
        "name": "Matilde Fernandes Goncalves",         // patient name
        "healthInsuranceCardId": "123456789",          // health insurance card id
        "address": "Rua Luís de Castro, 1182",         // patient address
        "createdAt": "2022-05-05"                      // patient created date
      })
})



app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocumento))

app.use('/crud', crud)


const PORT = 3000
app.listen(PORT, () =>{
    console.log('Aberto no: http://localhost:3000')
})