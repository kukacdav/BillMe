// Login controller
// This class has responsibility for all actions regarding Loging-in/out and registrating new user-accounts
// Created by: David Kukacka
// Function handeling Login logic

var loginController = {};

// Method for logging in user
// - if submitted data are complete, method calls communicationController for authentication
// - if data are not complete, view is notified
loginController.login = function(username, password) {
  console.log("Username: " + username + ", password: " + password);
  if ( username === "" ||  password === "" ) {
      showIncompleteLoggingInfo();
      return;
  }  
  showModal();
  var authentizationPerformed = $.when(communicationController.authenticateUser(username, password));
  authentizationPerformed.done(function(data) {
      storage.init(data);
      contactManager.initialize();
  });
  authentizationPerformed.fail(function(data) {
      hideModal();
      showFailedAuthorizationNote();
  });
};

// Method handeling initialization of application
// - attach socket.io listeners to events
// - get user data
// - get contact list from server
loginController.initializeApplication = function(){
    communicationController.initializeApplicationListeners();
    var appInitialized = $.when(communicationController.getUserData(storage.uid), communicationController.loadApplicationData(storage.uid, storage.cordovaContacts));
    appInitialized.done(function(userData, contactData)
    {
        storage.storeUserData(userData);
        storage.storeContactList(contactData);
        hideModal();
        navigationController.resetToPage('main-navigator', 'main-multi-page-template');
        //navigationController.replacePageWith('main-multi-page-template');
    });

};

// Method for registring new user
// - method captures event and displays register-template
loginController.register = function(){
    navigationController.pushPage('main-navigator', 'register-template');
};


//Method for submitting new registration 
// - Method recieves validated object and using communication-controller submits new user  

loginController.submitRegistration = function(newUser) {
    console.log("LoginController: Submitting registration");
    var registrationSubmitted = $.when(communicationController.createNewUser(newUser));
    registrationSubmitted.done(function(data)
    {
        console.log("LoginController: registrating user success");
        storage.registrationOutcome = "success";
        navigationController.pushPage('main-navigator', 'register-outcome-template');
    });
    registrationSubmitted.fail(function(data)
    {
        console.log("LoginController: registrating user failure");
        storage.registrationOutcome = "error";
        navigationController.pushPage('main-navigator', 'register-outcome-template');
    });
};

// Function for returning back to login page after outcome is displayed
loginController.backToLogin = function() {
    navigationController.resetToPage('main-navigator', 'login-template');
};

// Function for logout of previously logged-in user
loginController.logout = function() {
    var storageInitialized = $.when(communicationController.logoutUser());
    storageInitialized.done(function(userData)
    {
        navigationController.resetToPage('main-navigator','login-template');
    });    
};


    