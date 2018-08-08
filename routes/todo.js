const express =                 require('express'),
      router =                  express.Router();

const verifyToken =             require('../middleware/verify-token');
const verifyUserOwnsTodo =      require('../middleware/verify-user-owns-todo');

const response =                require('../functions/response');

const User =                    require('../models/user');
const List =                    require('../models/list');
const Todo =                    require('../models/todo');

router.use(verifyToken);

const populate = {
  path: 'boards',
  populate: {
    path: 'lists',
    populate: {
      path: 'todos'
    }
  }
}

// Get all todos
router.get('/', (req, res) => {
  // Find user by ID and populate data
  User.findById(req.userData.userId).populate(populate)
  .exec((err, user) => {
    // General error
    if(err) return response.sendErr(500, 'Could not get user data', res, err);
    // User does not exist
    if(user === null) return response.sendErr(500, 'User does not exist', res);
    let todos = [];
    // Loop through all of users boards, lists
    for(let i = 0; i < user.boards.length; i++) {
      for(let j = 0; j < user.boards[i].lists.length; j++) {
        // Add lists' todos to todos array
        todos.push(user.boards[i].lists[j].todos);
      }
    }
    res.json({msg: 'Todos fetched', todos});
  })
})

// Get todo by ID
router.get('/:id', verifyUserOwnsTodo, (req, res) => {
  // Find todo by ID
  Todo.findById(req.params.id)
  .exec((err, todo) => {
    // General error
    if(err) return response.sendErr(500, 'Could not get todo data', res, err);
    // Todo does not exist
    if(todo === null) return response.sendErr(500, 'Todo does not exist', res);
    res.json({msg: 'Todo fetched', todo});
  })
})

// Create new todo
router.post('/', (req, res) => {
  // Find user by ID and populate boards
  User.findById(req.userData.userId).populate('boards')
  .exec((err, user) => {
    // General error
    if(err) return response.sendErr(500, 'Could not get user data', res, err);
    // User does not exist
    if(user === null) return response.sendErr(500, 'User does not exist', res);
    // Loop through user all user boards and lists
    for(let i = 0; i < user.boards.length; i++) {
      for(let j = 0; j < user.boards[i].lists.length; j++) {
        // Check if user owns list by ID
        // user.boards[i].lists[j] is an ID not object
        if(user.boards[i].lists[j] == req.body.listId) {
          // Find list by ID
          List.findById(req.body.listId)
          .exec((err, list) => {
            // General error
            if(err) return response.sendErr(500, 'Could not get list data', res, err);
            // List does not exist
            if(list === null) return response.sendErr(500, 'List does not exist', res);
            // Create todo with todo data
            Todo.create(req.body.todo, (err, todo) => {
              // General error
              if(err || todo === null) return response.sendErr(500, 'Could not create todo', res, err);
              // Add todo id to lists' todos array
              list.todos.push(todo._id);
              list.save()
              // General error
              .catch(err => response.sendErr(500, 'Could not save list'), res, err);
              res.json({msg: 'Todo created', todo});
            })
          })
        }
      }
    }
  })
})

// Update todo by ID
router.put('/:id', verifyUserOwnsTodo, (req, res) => {
  // Find todo by ID and update with todo data
  Todo.findByIdAndUpdate(req.params.id, req.body.todo)
  .exec((err, todo) => {
    // General error
    if(err) return response.sendErr(500, 'Could not update todo', res, err);
    // Todo does not exist
    if(todo === null) return response.sendErr(500, 'Todo does not exist', res);
    res.json({res: 'Todo updated'});
  })
})

// Delete todo by ID
router.delete('/:id', verifyUserOwnsTodo, (req, res) => {
  // Find todo by ID and delete
  Todo.findByIdAndRemove(req.params.id)
  .exec((err, todo) => {
    // General error
    if(err) return response.sendErr(500, 'Could not delete todo', res, err);
    // Todo does not exist
    if(todo === null) return response.sendErr(500, 'Todo does not exist', res);
    res.json({res: 'Todo deleted'});
  })
})

module.exports = router;