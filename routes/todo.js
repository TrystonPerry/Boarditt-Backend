const express = require('express'),
      router = express.Router();

const verifyToken = require('../middleware/verify-token');

const User = require('../models/user'),
      Todo = require('../models/todo');

// Get all todos
router.get('/todos', (req, res) => {
  Todo.find({}, (err, todo) => {
    if(err)
      sendErr(err);
    else
      res.json(todo);
  })
})

// Get todo by ID
router.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if(err)
      sendErr(err);
    else
      res.json(todo);
  })
})

// Create new todo
router.post('/todos', (req, res) => {
  // Find list by body.list_id
  console.log(req.body.listId);
  List.findById(req.body.listId)
  .then(list => {
    console.log(list);
    // Create new todo
    Todo.create(req.body.todo)
    .then(todo => {
      // Add todo to lists todos array
      list.todos.push(todo._id);
      list.save()
      .then(() => res.json({res: 'todo created', todo}))
      .catch(err => sendErr(err));
    })
    .catch(err => sendErr(err));
  })
  .catch(err => sendErr(err));
})

// Update todo by ID
router.put('/todos/:id', (req, res) => {
  console.log('Route hit!');
  Todo.findByIdAndUpdate(req.params.id, req.body.todo)
  .then(() => res.json({res: 'todo updated'}))
  .catch(err => sendErr(err));
})

// Delete todo by ID
router.delete('/todos/:id', (req, res) => {
  Todo.findByIdAndRemove(req.params.id)
  .then(() => res.json({res: 'todo removed'}))
  .catch(err => sendErr(err));
})

module.exports = router;