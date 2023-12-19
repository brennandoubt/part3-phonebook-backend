const express = require('express')
const app = express()

app.use(express.json())

const generateId = () => Math.random() * (entries.length * 2)

app.post('/api/persons', (request, response) => {
   const body = request.body

   // posting entry has missing data (no name/number)
   if (!(body.name || body.number)) {
      return response.status(400).json({
         error: `Content missing`
      })
   }
   const entry = {
      id: generateId(),
      name: body.name,
      number: body.number
   }

   entries = entries.concat(entry)
   response.json(entry)
})

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

const PORT = 3001
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})