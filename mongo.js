const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://bdoubt:${password}@cluster0.drtm2fq.mongodb.net/entryApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name: String,
  number: String
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length === 3) {
  Entry.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(entry => {
      console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close() // will wait for find method to finish inside callback function
  })
} else if (process.argv.length === 5) {
  const entry = new Entry({
    name: process.argv[3],
    number: process.argv[4]
  })

  entry.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

