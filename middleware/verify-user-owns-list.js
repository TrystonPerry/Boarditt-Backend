const User =                    require('../models/user');

const response =                require('../functions/response');

module.exports = (req, res, next) => {
  // Find user by ID and populate boards to compare
  User.findById(req.userData.userId).populate('boards').exec()
  .then(user => {
    if(user === null) return response.sendErr(500, 'User does not exist', res);
    // Loop through all users boards and lists to compare list IDs
    for(let i = 0; i < user.boards.length; i++) {
      for(let j = 0; j < user.boards[i].lists.length; j++) {
        // Check if user owns list by ID if they match
        // user.boards[i].lists[j] is an ID not an object
        if(user.boards[i].lists[j] == req.params.id) {
          return next();
        }
      }
    }
    // User didnt have access to that list
    return response.sendErr(401, 'You dont have access to that list', res);
  })
  // Error
  .catch(err => response.sendErr(500, 'Could not get user data', res, err));
}