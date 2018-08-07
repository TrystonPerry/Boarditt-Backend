const express =                 require('express');
const router =                  express.Router();

const verifyToken =             require('../middleware/verify-token');
const verifyUserOwnsBoard =     require('../middleware/verify-user-owns-board');

const response =              require('../functions/response');

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
  User.findById(req.userData.userId).populate(populate)
  .exec((err, user) => {
    if(err) return response.sendErr(500, 'Could not get your boards', res, err);
    if(user.boards.length < 0) return response.sendMsg(200, 'You have no boards', res);
    res.json({msg: 'Boards fetched', boards: user.boards});
  })
})

// Get board by ID
router.get('/:id', verifyUserOwnsBoard, (req, res) => {
  Board.findById(req.params.id).populate(populate)
  .exec((err, board) => {
    if(err) return response.sendErr(500, 'Could not find board', res, err);
    res.json({msg: board.title + ' fetched', board});
  })
})

// Create new board
router.post('/', (req, res) => {
  User.findById(req.userData.userId)
  .then(user => {
    Board.create(req.body.board)
    .then(board => {
      user.boards.push(board._id);
      user.save()
      .catch(err => response.sendErr(500, 'Could not save board', res, err));
      res.json({msg: board.title + ' created', board});
    })
    .catch(err => response.sendErr(500, 'Could not create board', res, err));
  })
  .catch(err => response.sendErr(500, 'Could not find user data'));
})

// Update board by ID
router.put('/:id', verifyUserOwnsBoard, (req, res) => {
  Board.findByIdAndUpdate(req.params.id, req.body.board)
  .then(board => res.json({msg: 'Board updated'}))
  .catch(err => response.sendErr(500, 'Could not update board', res, err));
})

// Delete board by ID
router.delete('/:id', verifyUserOwnsBoard, (req, res) => {
  Board.findByIdAndRemove(req.params.id)
  .then(() => res.json({msg: 'Board deleted'}))
  .catch(err => response.sendErr(500, 'Could not delete board', res, err));
})

module.exports = router;