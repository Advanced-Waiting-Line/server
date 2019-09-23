module.exports = function (err, req, res, next){
<<<<<<< HEAD
  console.log('masuk error handling')
=======
  // console.log('masuk error handling')
>>>>>>> 5c6fa63d816a463b4a8de02b2035357e24ed3a92
  console.log(err)

  if (err.name === "ValidationError"){
    let status = 400
    let code = 400
    let message = err.message
    res.status(status).json({ code, message})
  }
  else if (err.message === 'wrong email/password'){
    let status = 401
    let code = 401
    let message = err.message
    res.status(status).json({code, message})
  }
  else {
    let status = err.status || err.code || 500
    let message = err.message || 'internal server error'
    res.status(status).json({message: message})
  }
}