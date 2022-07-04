const mongoose = require('mongoose')
let Schema = new mongoose.Schema({
  liveId: String,
  chanelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Chanel'},
}, {
  timestamps: true
})

module.exports = mongoose.model('LiveId', Schema)