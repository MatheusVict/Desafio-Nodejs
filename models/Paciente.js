const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Paciente = new Schema({
    nome: {
        type: String,
        required: true
    },
    endereco: {
        type: String,
        required: true
    },
    cartao: {
        type: Number,
        required: true
    },
    date: {
        type: Date,                                                     
        default: Date.now()
    }

})

mongoose.model('pacientes', Paciente)
