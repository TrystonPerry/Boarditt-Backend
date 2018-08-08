const User =                    require('../models/user');

const response =                require('../functions/response');

module.exports = (req, res, next) => {
  // Find user by ID and populate boards and lists to compare todo ids
  User.findById(req.userData.userId).populate({
    path: 'boards',
    populate: {
      path: 'lists'
    }
  }).exec()
  .then(user => {
    // User does not exist
    if(user === null) return response.sendErr(500, 'User does not exist', res);
    // Loop through all users boards, lists, and todos
    for(let i = 0; i < user.boards.length; i++) {
      for(let j = 0; j < user.boards[i].lists.length; j++) {
        for(let k = 0; k < user.boards[i].lists[j].todos.length; k++) {
          // Check if user owns todo by ID
          if(user.boards[i].lists[j].todos[k] == req.params.id) {
            return next();
          }
        }
      }
    }
    // User does not own todo
    response.sendErr(401, 'You dont have access to that todo', res);
  })
  // General error
  .catch(err => response.sendErr(500, 'Could not get user data', res ,err));
}