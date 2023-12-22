const express = require('express')
const app = express()
require('dotenv').config()

const Entry = require('./models/entry')

app.use(express.json()) // json-parser (middleware)

// make express show static content fetched from http requests
app.use(express.static('dist'))

// enable cross-origin requests (middleware)
const cors = require('cors')
app.use(cors())

// Middleware: functions to handle request/response objects
const requestLogger = (request, response, next) => {
   console.log('Method:', request.method)
   console.log('Path:  ', request.path)
   console.log('Body:  ', request.body)
   console.log('---')
   //next()  // yield control to next middleware
}
//app.use(requestLogger) // take middleware into use

let morgan = require('morgan')
const note = require('../fullstackopen2023/part3/models/note')
//app.use(morgan('tiny')) // log messages to console

// middleware to log http post request data
morgan.token('postdata', (request, response) => {
   if (request.method === 'POST') return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

const generateId = () => Math.random() * (entries.length * 2)

let entries = [
]

app.delete('/api/persons/:id', (request, response, next) => {
   Entry.findByIdAndDelete(request.params.id)
      .then(result => {
         response.status(204).end()
      })
      .catch(error => next(error))
})

app.get('/', (request, response, next) => {
   response.send(
      `<h1>Hello phonebook!</h1>`
   )
   .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
   Entry.find({}).then(entries => {
      console.log(entries)
      response.json(entries)
   })
   .catch(error => next(error))
})
app.get('/info', (request, response, next) => {
   Entry.find({}).then(entries => {
      response.send(
         `<p>Phonebook has info for ${entries.length} people</p>${new Date()}`
      )
   })
   .catch(error => next(error))
})
app.get('/api/persons/:id', (request, response, next) => {
   // const id = Number(request.params.id)
   // const entry = entries.find(e => e.id === id)

   // if (entry) {
   //    response.json(entry)
   // } else {
   //    response.status(404).end()
   // }

   Entry.findById(request.params.id).then(entry => {
      console.log(`response: ${entry}`)
      response.json(entry)
   })
   .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
   const body = request.body

   // posting entry has missing data (no name/number)
   if (!(body.name || body.number)) {
      return response.status(400).json({
         error: `Name and number missing`
      })
   } else if (!body.name) {
      return response.status(400).json({
         error: `Name missing`
      })
   } else if (!body.number) {
      return response.status(400).json({
         error: `Number missing`
      })
   }

   const entry = new Entry({
      name: body.name,
      number: body.number
   })

   entry.save().then(savedEntry => {
      response.json(savedEntry)
   })
   .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
   const body = request.body

   const entry = {
      name: body.name,
      number: body.number,
   }

   Entry.findByIdAndUpdate(request.params.id, entry, { new: true })
      .then(updatedEntry => {
         response.json(updatedEntry)
      })
      .catch(error => next(error))
})

// middleware to catch requests made to non-existent routes
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
   console.error(error.message)
   if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
   }
   next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})