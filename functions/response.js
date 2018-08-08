module.exports = {
  // Send a JSON error with a status code and error message
  sendErr: function(statusCode, errorMessage, res, err) {
    if(err) console.error(err);
    if(res && errorMessage) res.status(statusCode || 404).json({err: errorMessage});
  },
  // Send a JSON message with a status code and message
  sendMsg: function(statusCode, successMessage, res) {
    res.status(statusCode).json({msg: successMessage});
  }
}