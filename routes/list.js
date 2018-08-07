const express =               require('express');
const router =                express.Router();

const verifyToken =           require('../middleware/verify-token');
const verifyUserOwnsList =    require('../middleware/verify-user-owns-list');

const response =              require('../functions/response');

const User =                  require('../models/user');
const List =                  require('../models/list');

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
  User.findById(req.userData.userId).populate(populate)
  .exec((err, user) => {
    if(err) return response.sendErr(500, 'Could not get user', res, err);
    if(user.boards.length < 1) return response.sendMsg(200, 'User has no boards', res);
    let lists = [];
    for(let i = 0; i < user.boards.length; i++) {
      lists.push(user.boards[i].lists);
    }
    return res.json({msg: 'Lists fetched', lists});
  })
})

// Get list by ID
router.get('/:id', verifyUserOwnsList, (req, res) => {
  // Find list by ID and populate the todos array
  List.find(req.params.id)
  .then(list => res.json({msg: 'List fetched', list}))
  .catch(err => response.sendErr(500, 'Could not find list', res, err));
})

// Create new list
router.post('/lists', (req, res) => {
  User.findById(req.userData.userId)
  .then(user => {
    // Get board by body.board_id
    Board.findById(req.body.boardId)
    .then(board => {
      // Create new list
      List.create(req.body.list)
      .then(list => {
        // Add list ID reference to board lists array
        user.lists.push(list._id);
        board.lists.push(list._id);
        user.save()
        .catch(err => response.sendErr(500, 'Could not save user', res, err));
        board.save()
        .then(() => res.json({res: list.title + ' created', list}))
        .catch(err => response.sendErr(500, 'Could not save board', res, err));
      })
      .catch(err => response.sendErr(500, 'Internal Server Error', res, err));
    })
    .catch(err => response.sendErr(500, 'Internal Server Error', res, err));
  })
  .catch(err => response.sendErr(404, 'Internal Server Error', res, err));
})

// Update list by ID
router.put('/lists/:id', verifyUserOwnsList, (req, res) => {
  // Update list by ID
  List.findByIdAndUpdate(req.params.id, req.body.list)
  .then(() => response.sendMsg(200, 'List updated', res))
  // Couldnt update list
  .catch(err => response.sendErr(500, 'Could not update list', res, err));
})

// Delete list by ID
router.delete('/lists/:id', verifyUserOwnsList, (req, res) => {
  List.findByIdAndRemove(req.params.id)
  .then(() => response.sendMsg(200, 'List deleted', res))
  .catch(err => response.sendErr(500, 'Could not delete list', res, err));
})

module.exports = router;