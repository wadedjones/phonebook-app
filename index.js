const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('content', function getContent (req) {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time :content'))

let phonebook = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      }
]

const generateId = () => {
    const maxId = phonebook.length > 0
        ? Math.max(...phonebook.map(p => p.id))
        : 0
    return maxId + 1
}

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const numPeople = phonebook.length
    const timeOfRequest = new Date(Date.now())
    response.send(
        `<p>Phonebook has info for ${numPeople} people.</p> <p>${timeOfRequest}</p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    const duplicatePerson = phonebook.find(p => p.name === body.name)
    console.log(body)
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if (duplicatePerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }
    phonebook = phonebook.concat(person)
    response.json(person)
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