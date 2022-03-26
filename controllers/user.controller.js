
const mongoose = require('mongoose');
var config = require('../config')
const User = require('../models/user.modal').UserModal
var joi = require('joi')


var hexa_regex = '^[0-9a-fA-F]{24}$'
var regex_id_validation = joi.string().pattern(new RegExp(hexa_regex)).required()
var optional_regex_id_validation = joi.string().pattern(new RegExp(hexa_regex)).allow(null)


module.exports.userIdValidation = joi.object().keys({
  _Id: joi.string().required()
})

module.exports.getAllUsers = (req, res, next) => {
  var retObj = {
      message: 'Error Getting Users',
      status: false,
      details: []
  }
  User.find({}, { password: 0 }, (err, user_data) => {
      if (err) {
          console.log(retObj.message, err)
          return res.json(retObj);
      } else {
          retObj.message = 'Found All Users'
          retObj.status = true
          retObj.details = user_data
          return res.json(retObj);
      }
  })

};

module.exports.getUserById = (req, res, next) => {
  var userId = req.params['_Id'] 
  var retObj = {
    status: false,
    message: "Err Querying database for User by id, Try again",
    details: []
  };
  User.findById(userId, {}, function(errusr, usr) {
    if (errusr) {
      res.json(retObj);
    } else {
      retObj.status = true;
      retObj.message = "User found by id : " +userId;
      retObj.details = usr;
      res.json(retObj);
    }
  });
}

module.exports.addUser = async (req, res) => {
  var user = req.body
  console.log(user);
  var retObj = {
    status: false,
    message: "Err Adding user, Try again",
    details: []
  };
  var query = {}
  if(user._id) query._id = user._id
  else { 
    query._id = mongoose.Types.ObjectId()
  }
    try {
      User.updateOne(query, user, {upsert: true}, (err, result)=>{
        if(err) {
          console.log("Error In Upsert User");
          console.log(err);
          res.json(retObj)
        } else {
          if(user._id) {
            retObj.message = "Updated Successfully"
          } else {
            retObj.message = "Inserted Successfully"
          }
          retObj.status = true;
          retObj.details = result;
          res.json(retObj)
        }
      });
    } catch (error) {
      console.log('Unable to get user document count', error);
      res.json(retObj)
    }
  
  
}

module.exports.updateUserDetails = (req, res) => {
  var userId = req.params['_Id']
  var userDetails = req.body
  console.log('Update User Details',userDetails);

  var retObj = {
    status: false,
    message: "Err Updating  Details for User By Id: " + userId,
    details: []
  };

  User.updateOne({_id: userId}, userDetails).exec()
  .then(done => {
    retObj.status = true;
    retObj.message = "Successfully Updated Item Details"
    retObj.details = [done]
    res.json(retObj)
  })
  .catch(err => {
    console.log('Error updating Item details', err);
    res.json(retObj)
  })
}

module.exports.deleteUser = async (req, res) => {
  var userId = req.params['_Id']
  var retObj = {
    status: false,
    message: "Err Removing User, Try again",
    details: []
  };
  try{
    var user = await User.find({_id: userId})
    if(user.length>0) {
      var delete_user = await User.findOneAndRemove({_id: userId})
      console.log('Deleted User', delete_user);
      if(delete_user) {
        retObj.status = true;
        retObj.message = "Success User Deleted";
        retObj.details = delete_user;
        res.json(retObj);
      } else {
        retObj.status = false;
        retObj.message = "Error Deleting User";
        retObj.details = delete_user;
        res.json(retObj);
      }
  
    } else {
      retObj.message = 'User Does Not exists!'
      res.json(retObj);
    }
  } catch(err) {
    console.log('Server Err: Removing Item From User: '+userId)
    console.log(err)
    res.json(retObj);
  }
}




