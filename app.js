// NPM Packages
const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose');

// MongoDB Models
const Todo = require('./models/todo'),
      List = require('./models/list'),
      Board = require('./models/board');

// Express Extensions
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Connect to MongoDB Database
mongoose.connect('mongodb://admin:1qaQANsv7VE9FqXVhu0m912BAcUVX1@ds139921.mlab.com:39921/boarditt', {useNewUrlParser: true});

// API Routes
// API Hompeage - Guide
app.get('/', (req, res) => {
  res.sendFile('./views/index.html', {root: __dirname});
})

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// Populate board with all List and Todo Data
const populateBoards = {
    path: 'lists',
    populate: {
      path: 'todos'
    }
}

// Get all boards
app.get('/boards', (req, res) => {
  Board.find({}).populate(populateBoards)
  .exec((err, boards) => {
    if(err)
      catchErr(err);
    else 
      res.json(boards);
  })
})

// Get board by ID
app.get('/boards/:id', (req, res) => {
  Board.findById(req.params.id).populate(populateBoards)
  .exec((err, board) => {
    if(err)
      catchErr(err);
    else
      res.json(board);
  })
})

// Create new board
app.post('/boards', (req, res) => {
  Board.create(req.body.board)
  .then(board => res.json({res: board.title + ' created'}))
  .catch(err => {
    catchErr(err);
  });
})

// Update board by ID
app.put('/boards/:id', (req, res) => {
  Board.findByIdAndUpdate(req.params.id, req.body.board)
  .then(board => res.json({res: board.title + ' updated'}))
  .catch(err => catchErr(err));
})

// Delete board by ID
app.delete('/boards/:id', (req, res) => {
  Board.findByIdAndRemove(req.params.id, req.body.board)
  .then(board => res.json({res: board.title + ' deleted'}))
  .catch(err => catchErr(err));
})

// Get all lists
app.get('/lists', (req, res) => {
  List.find({}).populate('todos')
  .exec((err, lists) => {
    if(err)
      catchErr(err);
    else
      res.json(lists);
  })
})

// Get list by ID
app.get('/lists/:id', (req, res) => {
  List.findById(req.params.id).populate('todos')
  .exec((err, list) => {
    if(err)
      catchErr(err);
    else 
      res.json(list);
  })
})

// Create new list
app.post('/lists', (req, res) => {
  // Get board by body.board_id
  Board.findById(req.body.boardId)
  .then(board => {
    // Create new list
    List.create(req.body.list)
    .then(list => {
      // Add list ID reference to board lists array
      board.lists.push(list._id);
      board.save()
      .then(list => res.json({res: list.title + ' created'}));
    })
    .catch(err => catchErr(err));
  })
  .catch(err => catchErr(err));
})

// Update list by ID
app.put('/lists/:id', (req, res) => {
  List.findByIdAndUpdate(req.params.id, req.body.list)
  .then(list => res.json({res: list.title + ' updated'}))
  .catch(err => catchErr(err));
})

// Delete list by ID
app.delete('/lists/:id', (req, res) => {
  List.findByIdAndRemove(req.params.id)
  .then(list => res.json({res: list.title + ' deleted'}))
  .catch(err => catchErr(err));
})

// Get all todos
app.get('/todos', (req, res) => {
  Todo.find({}, (err, todo) => {
    if(err)
      catchErr(err);
    else
      res.json(todo);
  })
})

// Get todo by ID
app.get('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if(err)
      catchErr(err);
    else
      res.json(todo);
  })
})

// Create new todo
app.post('/todos', (req, res) => {
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
      .catch(err => catchErr(err));
    })
    .catch(err => catchErr(err));
  })
  .catch(err => catchErr(err));
})

// Update todo by ID
app.put('/todos/:id', (req, res) => {
  console.log('Route hit!');
  Todo.findByIdAndUpdate(req.params.id, req.body.todo)
  .then(() => res.json({res: 'todo updated'}))
  .catch(err => catchErr(err));
})

// Delete todo by ID
app.delete('/todos/:id', (req, res) => {
  Todo.findByIdAndRemove(req.params.id)
  .then(() => res.json({res: 'todo removed'}))
  .catch(err => catchErr(err));
})

// Error Handle
function catchErr(err){
  console.log(err);
}

// Start server
app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server started!');
})