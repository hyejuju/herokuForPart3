const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express() 

app.use(express.json())
app.use(cors())
morgan.token('data', function getData (req) {
  return req.method === 'POST' ? JSON.stringify(req.body) : null
})

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :data")
)

let persons = [
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
/* const app = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(persons, null, 2))
  }) */

app.get('/info', (request, response) => {
    var date = new Date();
    response.send(`<p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
    `)
  })
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id',(request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(p => p.id ===id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)
    
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    const person = {
      id: Math.floor(Math.random() * 10000),
      name: body.name,
      number: body.number,
    }

    const names = persons.map(p=>p.name)
    if (!body.name) {
      return response.status(400).json({
        error: 'name missing'
      })
    }
    else if (!body.number) {
      return response.status(400).json({
        error: 'number missing'
      })
    }
    else if(names.some(n => n===body.name)){
      return response.status(400).json({
        error: 'name must be unique'
      })
    }
    else{
      persons = persons.concat(person)
      response.json(person)
    }


    /* if (!body.name || !body.number) {
        return response.status(400).json({
          error: 'name or number missing'
        })
      }
     
      const person = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number,
        
      }
    
      person
      .save()
      .then(savedPerson => savedPerson.toJSON())
      .then(savedAndFormattedPerson => response.json(savedAndFormattedPerson))
      .catch(error => next(error)) */
  })

  const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})