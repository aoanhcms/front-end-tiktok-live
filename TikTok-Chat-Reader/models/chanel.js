const mongoose = require('mongoose')
let Schema = new mongoose.Schema({
  username: String,
}, {
  timestamps: true
})

module.exports = mongoose.model('Chanel', Schema)