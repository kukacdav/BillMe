// User controller
// This class has responsibility for handeling user data related logic
// Created by: David Kukacka

var userController = {};

userController.validateChangedUserPassword = function (password1, password2, password3){
  console.log("UserController: validate password change");
  if (storage.password === password1){
      console.log("UserController: Old password OK");
      if (password2 === password3){
          console.log("Passwords are identical");
          userController.changePassword(password2);
      }
      else
        showChangePasswordError("Zadaná hesla se neshodují!");
  }
  else
    showChangePasswordError("Původní heslo bylo špatně zadané");
};

userController.changePassword = function (password){
    console.log("Changing password");
    showModal();
    var passwordChanged = $.when(communicationController.changeUserPassword(storage.uid, password));
    passwordChanged.done(function(data) {
      storage.password = password;
      pageController.showSuccessActionPage('moreOptionsNavigator', "changedPassword");
  });
    
};