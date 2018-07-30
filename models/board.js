const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
  title: String,
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  }]
})

module.exports = mongoose.model('Board', boardSchema);