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
    var contact = {};
    var bankAccount = {};
    
    newUser.username = document.querySelector('#register-username').value;
    newUser.forename = document.querySelector('#register-forename').value;
    newUser.surname = document.querySelector('#register-surname').value;
    contact.phone = document.querySelector('#register-phone').value;
    contact.email = document.querySelector('#register-email').value;
    contact.facebook = document.querySelector('#register-facebook').value;
    bankAccount.accountPrefix = document.querySelector('#register-prefix').value;
    bankAccount.accountNumber = document.querySelector('#register-account').value;
    bankAccount.bankCode = document.querySelector('#register-bankCode').value;
    bankAccount.accountName = "Můj účet";
    newUser.password = document.querySelector('#register-password').value;
    
    if (newUser.username === "" || newUser.forename === "" || newUser.surname === "" || contact.phone === "" || bankAccount.accountNumber === "" || bankAccount.accountName === "" || bankAccount.accountPrefix === "" || bankAccount.bankCode === "" || newUser.password === "")
    {
        ons.notification.alert(
        {
            message: 'Všechna pole musí být vyplněna!'
        }
        );
         return;
    }  
     else {
    newUser.contact = contact;
    newUser.bankAccount = bankAccount;
    communicationController.createNewUser(newUser);
    document.querySelector('#main-navigator').resetToPage('login-template');
  }
};

backToLogin = function() {
    navigationController.replacePageWith('login-template');        
};


    