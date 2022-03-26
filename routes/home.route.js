var express = require('express');
var router = express.Router();
const userController = require('../controllers/user.controller')
const homeController = require('../controllers/home.controller')

router.get('/all', userController.getAllUsers);

router.get("/:_Id",  userController.getUserById);
router.post("/addUser",  userController.addUser);
router.post("/updateUser/:_Id",  userController.updateUserDetails);
router.delete("/deleteUser/:_Id",  userController.deleteUser);

router.post("/image/:_Id",  homeController.uploadImage);


module.exports = router;