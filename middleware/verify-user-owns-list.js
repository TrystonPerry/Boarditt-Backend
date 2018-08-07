const User =              require('../models/user');

const response =          require('../functions/response');

module.exports = (req, res, next) => {
  // Find user by ID
  User.findById(req.userData.userId).populate('boards').exec()
  .then(user => {
    for(let i = 0; i < user.boards.length; i++) {
      for(let j = 0; j < user.boards[i].lists.length; j++) {
        if(user.boards[i].lists[j] === req.params.id) {
          return next();
        }
      }
    }
    // User didnt have access to that list
    return response.sendErr(401, 'You dont have access to that list', res);
  })
  // Couldnt find a user with that ID
  .catch(err => response.sendErr(500, 'Could not get user data', res, err));
}