const User = require('../models/user');

const response = require('../functions/response');

module.exports = (req, res, next) => {
  // Find user by ID
  User.findById(req.userData.userId)
  .then(user => {
    // Loop through all of users boards
    for(let i = 0; i < user.boards.length; i++){
      // Check if user owns or has access to board
      // user.boards[i] is a board ID not object
      if(user.boards[i] == req.params.id) {
        return next();
      }
    }
    // User didnt have access to that board
    return response.sendErr(401, 'You dont have access to that board', res);
  })
  // Couldnt find a user with that ID
  .catch(err => response.sendErr(500, 'Could not find user', res, err));
}