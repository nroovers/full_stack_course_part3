const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())


let persons =
    [
        {
            "name": "Arto Hellas",
            "number": "040-123456",
            "id": 1
        },
        {
            "name": "Ada Lovelace",
            "number": "39-44-5323523",
            "id": 2
        },
        {
            "name": "Dan Abramov",
            "number": "12-43-234345",
            "id": 3
        },
        {
            "name": "Mary Poppendieck",
            "number": "39-23-6423122",
            "id": 4
        }
    ]


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res) => {
    var resText = ''
    resText += `<div>Phonebook has info for ${persons.length} people</div>`
    resText += `<div>${new Date()}</div>`
    res.send(resText)
})

app.get('/api/persons', (req, res) => {
    console.log(`get ${req.originalUrl}`)
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    console.log(`get ${req.originalUrl}`)
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    }
    else { res.status(404).end() }
})

app.delete('/api/persons/:id', (req, res) => {
    console.log(`delete ${req.originalUrl}`)
    const id = Number(req.params.id)
    console.log(persons.length)
    persons = persons.filter(p => p.id !== id)
    console.log(persons.length)
    res.status(204).end()
})


app.post('/api/persons', (req, res) => {
    console.log(`post ${req.originalUrl}`)

    const person = req.body
    console.log(person)
    person.id = Math.floor(Math.random() * 1000) + 1
    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

