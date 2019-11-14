const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())

app.use(cors())

morgan.token('body', function (req, res) {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


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
    // console.log(`get ${req.originalUrl}`)
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    // console.log(`get ${req.originalUrl}`)
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    }
    else { res.status(404).end() }
})

app.delete('/api/persons/:id', (req, res) => {
    // console.log(`delete ${req.originalUrl}`)
    const id = Number(req.params.id)
    // console.log(persons.length)
    persons = persons.filter(p => p.id !== id)
    // console.log(persons.length)
    res.status(204).end()
})


app.post('/api/persons', (req, res) => {
    // console.log(`post ${req.originalUrl}`)

    const person = req.body
    // console.log(person)

    if (!person.name)
        return res.status(400).json({
            error: 'name missing'
        })

    if (!person.number)
        return res.status(400).json({
            error: 'number missing'
        })

    if (persons.find(p => p.name === person.name))
        return res.status(400).json({
            error: `person with name ${person.name} already exists`
        })

    person.id = Math.floor(Math.random() * 1000) + 1
    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`)
})
