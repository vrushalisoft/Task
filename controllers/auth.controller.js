
const config = require('../config')
const UserModal = require('../models/user.modal').UserModal


module.exports.login = async (req, res) => {
  
  var retObj = {
    message: 'User Not Found',
    status: false,
    details: []
  }
  try{
    var user = await UserModal.findOne({userName: req.body.userName})
    if(!user) {
      return res.json(retObj);
    } else {
      if (!user.validatePassword(req.body.password)) {
        retObj.message = 'User Name Or Password Invalid'
        return res.json(retObj)
      } else {
        console.log('User Found');
        var _token = user.generateLoginToken()
        var _user_data = user.getUserData()
        retObj.message = 'Logged In Successfully'
        retObj.status = true
        retObj.details = _user_data
        retObj.jwt_token = _token.token
        retObj.expires = _token.expires
        res.json(retObj);
      }
      }
    }
  catch(err) {
    console.log('Error while logging in ', err);
    res.json(retObj)
  }
}

module.exports.signUp = async (req, res) => {
  var retObj = {
    message: 'User Already Exists',
    status: false,
    details: []
  }
  try {
    var user = await UserModal.findOne({userName: req.body.userName})
    if(!user) {
      var user_data = req.body;
      var newUser = new UserModal(user_data)
      var saved = await newUser.save()
      retObj.message = "User signUp Successfully"
      retObj.details = saved
      retObj.status = true
      res.json(retObj)
    } else {
      return res.json(retObj);
    }
  } catch(err) {
    console.log('error creating  user', err);
    retObj.message = "Error while signUp User"
    retObj.details = []
    res.json(retObj)
  }
}

module.exports.logout = (req, res) => {
  var retObj = {
    message: 'User Logged Out Successfully',
    status: true,
    details: []
  }
  req.logout();
  //res.json(retObj)
  res.redirect('/login')
};





