var joi = require('joi')
var config = require('../config')
const User = require('../models/user.modal').UserModal



module.exports.uploadImage = (req, res) => {
    var userId = req.params['_Id']
    var updatedImage = req.file.path
  console.log('path',updatedImage )
    var retObj = {
      status: false,
      message: "Err Updating Image for user By Id: " + userId,
      details: []
    };
    try{
        if(user.req.role == 'admin'){
          User.findOneAndUpdate({_id: userId}, {image: updatedImage}).exec()
          .then(done => {
            retObj.status = true;
            retObj.message = "Successfully Updated user Image"
            retObj.details = {image: updatedImage}
            res.json(retObj)
          })
        }else {
          retObj.message = 'User not allowed to upload!'
          retObj.status = true
          res.json(retObj)
        }
    } catch(err)  {
      console.log('Error updating User image', err);
      res.json(retObj)
    }
  } 
