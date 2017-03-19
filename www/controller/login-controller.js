login = function() {
  var username = document.querySelector('#login-username').value;
  var password = document.querySelector('#login-password').value;
  console.log("Username: " + username + ", password: " + password);
  if ( username === "" ||  password === "" ) {
      showIncompleteLoggingInfo();
      return;
  }  
  communicationController.authenticateUser(username, password);  
};

showFailedAuthorizationNote = function() {
    document.querySelector('#login-note').innerHTML = "Špatné Uživatelské jméno nebo Heslo";    
    document.querySelector('#login-username').value = "";
    document.querySelector('#login-password').value = "";
};

showIncompleteLoggingInfo = function () {
  document.querySelector('#login-note').innerHTML = "Pro přihlášení musíte vyplnit Uživatelské jméno a Heslo";  
};


register = function(){
    document.querySelector('#main-navigator').pushPage('register-template');
    
};

submitRegistration = function() {
    var newUser = {};
    var bankAccount = {};    
    newUser.username = document.querySelector('#register-email').value;
    newUser.forename = document.querySelector('#register-forename').value;
    newUser.surname = document.querySelector('#register-surname').value;
    newUser.phoneNumber = document.querySelector('#register-phone').value;
    bankAccount.accountPrefix = document.querySelector('#register-prefix').value;
    bankAccount.accountNumber = document.querySelector('#register-account').value;
    bankAccount.bankCode = document.querySelector('#register-bankCode').value;
    bankAccount.accountName = "Můj účet";
    newUser.password = document.querySelector('#register-password').value;
    newUser.pin = document.querySelector('#register-pin').value;
    
    if (newUser.username === "" || newUser.forename === "" || newUser.surname === "" || newUser.phoneNumber === "" || bankAccount.accountNumber === "" || bankAccount.accountName === "" || bankAccount.bankCode === "" || newUser.password === "" || newUser.pin==="")
    {
        if (newUser.phoneNumber === ""){
            alert("\'" + newUser.phoneNumber +  "\'");
        }
            
        ons.notification.alert(
        {
            message: 'Všechna pole musí být vyplněna!'
        }
        );
         return;
    }  
     else {
    newUser.phoneNumber = transform(newUser.phoneNumber);
    newUser.bankAccount = bankAccount;
    communicationController.createNewUser(newUser);
    
  }
};

backToLogin = function() {
    navigationController.replacePageWith('login-template');        
};

logout = function() {
     var storageInitialized = $.when(communicationController.logoutUser());
    storageInitialized.done(function(userData)
    {
        navigationController.replacePageWith('login-template');
    });    
};

unsuccesfullRegistration = function(){
    document.querySelector('#main-navigator').resetToPage('login-template');
    document.querySelector('#login-note').innerHTML = "Zadané údaje jsou duplicitní";  
};
    