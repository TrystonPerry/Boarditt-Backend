const mongoose = require('mongoose');

const listSchema = mongoose.Schema({
  title: String,
  color: {
    type: String,
    default: 'white'
  },
  todos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo'
  }]
})

module.exports = mongoose.model('List', listSchema);