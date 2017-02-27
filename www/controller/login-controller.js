// This is a JavaScript file





login = function() {
  var username = document.querySelector('#login-username').value;
  var password = document.querySelector('#login-password').value;
  console.log(username);
  console.log(password);
  if ( username === "" ||  password === "" ) {
      showIncompleteLoggingInfo();
      return;
  }  
  authenticateUser(username, password);
  
};


showFailedAuthorizationNote = function() {
    document.querySelector('#login-note').innerHTML = "Špatné Uživatelské jméno nebo Heslo";    
    document.querySelector('#login-username').value = "";
    document.querySelector('#login-password').value = "";
};

showIncompleteLoggingInfo = function () {
  document.querySelector('#login-note').innerHTML = "Pro přihlášení musíte vyplnit Uživatelské jméno a Heslo";  
};