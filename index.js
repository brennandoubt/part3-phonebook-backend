const express = require('express')
const app = express()

app.use(express.json()) // json-parser (middleware)

const generateId = () => Math.random() * (entries.length * 2)

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
//app.use(morgan('tiny')) // log messages to console

// middleware to log http post request data
morgan.token('postdata', (request, response) => {
   if (request.method === 'POST') return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata'))

app.delete('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   entries = entries.filter(e => e.id !== id)

   response.status(204).end()
})

let entries = [
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
      "name": "Mary Poppendick",
      "number": "39-23-6423122"
   }
]

app.get('/api/persons', (request, response) => {
   response.json(entries)
})
app.get('/info', (request, response) => {
   response.send(
      `<p>Phonebook has info for ${entries.length} people<p>${new Date()}`
   )
})
app.get('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   const entry = entries.find(e => e.id === id)

   if (entry) {
      response.json(entry)
   } else {
      response.status(404).end()
   }
})

app.post('/api/persons', (request, response) => {
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
   const isUniqueName = (entries.every(e => e.name !== body.name))
   if (!isUniqueName) {
      return response.status(400).json({
         error: `Name already exists`
      })
   }

   const entry = {
      id: generateId(),
      name: body.name,
      number: body.number
   }

   entries = entries.concat(entry)
   response.json(entry) // send json data back to browser
})

// middleware to catch requests made to non-existent routes
const unknownEndpoint = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})