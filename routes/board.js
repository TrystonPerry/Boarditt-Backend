const express =                 require('express');
const router =                  express.Router();

const verifyToken =             require('../middleware/verify-token');
const verifyUserOwnsBoard =     require('../middleware/verify-user-owns-board');

const response =                require('../functions/response');

const User =                    require('../models/user');
const Board =                   require('../models/board');

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

// Get all boards
router.get('/', (req, res) => {
  // Find user by ID and populate all its data
  User.findById(req.userData.userId).populate(populate)
  .exec((err, user) => {
    // General error
    if(err) return response.sendErr(500, 'Could not get user data', res, err);
    // User has no boards
    if(user.boards.length === 0) return response.sendMsg(200, 'User has no boards', res);
    res.json({msg: 'Boards fetched', boards: user.boards});
  })
})

// Get board by ID
router.get('/:id', verifyUserOwnsBoard, (req, res) => {
  // Find board by ID and populate its data
  Board.findById(req.params.id).populate(populate)
  .exec((err, board) => {
    // General error
    if(err) return response.sendErr(500, 'Could not get board data', res, err);
    // Board does not exist
    if(board === null) return response.sendErr(500, 'Board does not exist', res);
    res.json({msg: 'Board fetched', board});
  })
})

// Create new board
router.post('/', (req, res) => {
  // Find user by ID
  User.findById(req.userData.userId)
  .then(user => {
    // Create board with board data
    Board.create(req.body.board)
    .then(board => {
      // Add board ID to users boards list
      user.boards.push(board._id);
      user.save()
      // General error
      .catch(err => response.sendErr(500, 'Could not save board', res, err));
      res.json({msg: 'Board created', board});
    })
    // General error
    .catch(err => response.sendErr(500, 'Could not create board', res, err));
  })
  // User does not exist
  .catch(err => response.sendErr(500, 'User does not exist', res));
})

// Update board by ID
router.put('/:id', verifyUserOwnsBoard, (req, res) => {
  // Find board by ID and update it with board data
  Board.findByIdAndUpdate(req.params.id, req.body.board)
  .exec((err, board) => {
    // General error
    if(err) return response.sendErr(500, 'Could not update board', res, err);
    // Board does not exist
    if(board === null) return response.sendErr(500, 'Board does not exist', res, err);
    res.json({msg: 'Board updated'});
  })
})

// Delete board by ID
router.delete('/:id', verifyUserOwnsBoard, (req, res) => {
  // Find board by ID and delete
  Board.findByIdAndRemove(req.params.id)
  .exec((err, board) => {
    // General error
    if(err) return response.sendErr(500, 'Could not delete board', res, err);
    // Board does not exist
    if(board === null) return response.sendErr(500, 'Board does not exist', res);
    res.json({msg: 'Board deleted'});
  })
})

module.exports = router;