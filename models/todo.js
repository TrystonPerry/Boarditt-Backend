const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
  value: String,
  isDone: Boolean
})

module.exports = mongoose.model('Todo', todoSchema);