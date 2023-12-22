/**
 * Entry model for phonebook app
 */
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
   .then(result => {
      console.log('connected to MongoDB')
   })
   .catch(error => {
      console.log('error connecting to MongoDB:', error.message)
      process.exit(1)
   })

const entrySchema = new mongoose.Schema({
   name: String,
   number: String
})

entrySchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__V
   }
})

module.exports = mongoose.model('Entry', entrySchema)