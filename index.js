require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time :content'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (request, response) => {
    const numPeople = phonebook.length
    const timeOfRequest = new Date(Date.now())
    response.send(
        `<p>Phonebook has info for ${numPeople} people.</p> <p>${timeOfRequest}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    //const duplicatePerson = phonebook.find(p => p.name === body.name)
    //console.log(body)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    /*
    if (duplicatePerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    */

    const person = new Person ({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(p => p.id !== id)
    response.status(204).end()
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})