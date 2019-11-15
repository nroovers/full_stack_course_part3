require('dotenv').config()

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))

app.use(bodyParser.json())

app.use(cors())

morgan.token('body', function (req, res) {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/info', (req, res, next) => {
    Person.countDocuments({})
        .then(c => {
            console.log('Person count', c)

            var resText = ''
            resText += `<div>Phonebook has info for ${c} people</div>`
            resText += `<div>${new Date()}</div>`
            res.send(resText)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (req, res) => {
    Person.find({})
        .then(persons => {
            res.json(persons.map(p => p.toJSON()))
        });
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            if (person)
                res.json(person)
            else
                res.status(404).end()
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            console.log('person removed: ', result)
            res.status(204).end()
        })
        .catch(error => { next(error) })
})

app.post('/api/persons', (req, res) => {
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

    // if (persons.find(p => p.name === person.name))
    //     return res.status(400).json({
    //         error: `person with name ${person.name} already exists`
    //     })

    const newPerson = Person({
        name: person.name,
        number: person.number
    })

    newPerson.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })
})


app.put('/api/persons/:id', (req, res, next) => {
    const person = req.body

    const newPerson = {
        name: person.name,
        number: person.number
    }

    console.log('PUT Person', req.params.id, person, newPerson)

    Person.findByIdAndUpdate(req.params.id, newPerson, { new: true })
        .then(p => {
            console.log(p)
            res.json(p.toJSON())
        }
        )
        .catch(error => next(error))
})


const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
    console.error('ERROR handler', error)

    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
})
