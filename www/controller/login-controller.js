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
