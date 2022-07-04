const mongoose = require('mongoose')
let Schema = new mongoose.Schema({
  userId: String,
  nickname: String,
  uniqueId: String,
  image: String,
  commentCount: {
    type: Number, default: 0
  },
  liveId: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveId'},
}, {
  timestamps: true
})

module.exports = mongoose.model('User', Schema)