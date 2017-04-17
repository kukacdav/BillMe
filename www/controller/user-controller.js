// User controller
// This class has responsibility for handeling user data related logic
// Created by: David Kukacka

var userController = {};

// Method for changing user password - handeling logic, whether password can be changed
// Method validates submitted passwords and in case of match invokes password change 
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

// Method for changing password
// Method recieves validated new password and handles process of password change
userController.changePassword = function (password){
    console.log("Changing password");
    showModal();
    var passwordChanged = $.when(communicationController.changeUserPassword(storage.uid, password));
    passwordChanged.done(function(data) {
      storage.password = password;
      pageController.showSuccessActionPage('moreOptionsNavigator', "changedPassword");
  });
};

// Method for validating, whether PIN can be changed
// In event of success, method invokes pin change
// In event of failure, method invokes error display
userController.validateChangedPIN = function (pin1, pin2, pin3){    
    console.log("UserController: changing pin");
    if (pin1 === storage.userData.pin){
        console.log("PIN is OK");
        if (pin2 === pin3){
            userController.changePIN(pin2);
        }
        else
            showChangePINError("Zadaná hodnoty PIN se neshodují!");
    }
    else
        showChangePINError("Původní PIN byl špatně zadán!");
};


userController.changePIN = function(pin){
    console.log("Changing PIN");
    showModal();
    var PINChanged = $.when(communicationController.changeUserPIN(storage.uid, pin));
    PINChanged.done(function(data) {
      storage.userData.pin = pin;
      pageController.showSuccessActionPage('moreOptionsNavigator', "changedPIN");
  });
    
};