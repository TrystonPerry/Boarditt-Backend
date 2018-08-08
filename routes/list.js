const express =                 require('express');
const router =                  express.Router();

const verifyToken =             require('../middleware/verify-token');
const verifyUserOwnsList =      require('../middleware/verify-user-owns-list');

const response =                require('../functions/response');

const User =                    require('../models/user');
const Board =                   require('../models/board');
const List =                    require('../models/list');

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

// Get all lists
router.get('/', (req, res) => {
  // Find user by ID and populate all data
  User.findById(req.userData.userId).populate(populate)
  .exec((err, user) => {
    // General error
    if(err) return response.sendErr(500, 'Could not get user data', res, err);
    // If user has no boards
    if(user.boards.length === 0) return response.sendMsg(200, 'User has no boards', res);
    let lists = [];
    // Loop through all users boards
    for(let i = 0; i < user.boards.length; i++) {
      // Add all lists from board
      lists.push(user.boards[i].lists);
    }
    res.json({msg: 'Lists fetched', lists});
  })
})

// Get list by ID
router.get('/:id', verifyUserOwnsList, (req, res) => {
  // Find list by ID and populate the todos array
  List.findById(req.params.id)
  .exec((err, list) => {
    // General error
    if(err) return response.sendErr(500, 'Could not get list data', res, err);
    // List does not exist
    if(list === null) return response.sendErr(500, 'List does not exist', res);
    res.json({msg: 'List fetched', list});
  })
})

// Create new list
router.post('/', (req, res) => {
  // Get user by ID
  User.findById(req.userData.userId)
  .exec((err, user) => {
    // General error
    if(err) return response.sendErr(500, 'Could not get user data', res, err);
    // User does not exist
    if(user === null) return response.sendErr(500, 'User does not exist', res);
    // Loop through all users boards
    for(let i = 0; i < user.boards.length; i++) {
      // Check if user owns board by ID
      // user.boards[i] is an ID not object
      if(user.boards[i] == req.body.boardId){
        // Find board by ID
        Board.findById(req.body.boardId)
        .exec((err, board) => {
          // General error
          if(err) return response.sendErr(500, 'Could not get board data', res, err);
          // Board does not exist
          if(board === null) return response.sendErr(500, 'Board does not exist', res);
          // Create list with list data
          List.create(req.body.list, (err, list) => {
            // General error
            if(err || list === null) return response.sendErr(500, 'Could not create list', res, err);
            // Add list ID to boards.lists
            board.lists.push(list._id);
            board.save()
            // General error
            .catch(err => response.sendErr(500, 'Could not save board', res, err));
            res.json({msg: 'List created', list});
          })
        })
        return;
      }
    }
    // User does not have access to board
    response.sendErr(500, 'You dont have access to that board', res);
  })
})

// Update list by ID
router.put('/:id', verifyUserOwnsList, (req, res) => {
  // Find list by ID and update with list data
  List.findByIdAndUpdate(req.params.id, req.body.list)
  .exec((err, list) => {
    // General error
    if(err) return response.sendErr(500, 'Could not update list', res, err);
    // List does not exist
    if(list === null) return response.sendErr(500, 'List does not exist', res);
    res.json({msg: 'List updated'});
  })
})

// Delete list by ID
router.delete('/:id', verifyUserOwnsList, (req, res) => {
  // Find list by ID and delete
  List.findByIdAndRemove(req.params.id)
  .exec((err, list) => {
    // General error
    if(err) return response.sendErr(500, 'Could not delete list', res, err);
    // List does not exist
    if(list === null) return response.sendErr(500, 'List does not exist', res);
    res.json({msg: 'List deleted'});
  })
})

module.exports = router;