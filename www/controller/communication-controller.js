// Communication controller
// This class handles all comunication between client a server
// Created by: David Kukacka

// Method for establishing socket communication. Via socket communication application is notified about new transactions.
communicationController.initializeApplicationListeners = function(){
    console.log("Creating socket listeners");
    console.log(storage.uid);
    var socket = io.connect(deploydEndpoint);
    // Listening for new incoming payments
    socket.on('payment:' + storage.uid, function(data){
        console.log("---- COLLECTION CHANGE: New payment ------" );
        console.log(JSON.stringify(data));
        storage.newIncomingPayment(data);
    });
    // Listening for new incoming requests
    socket.on('request:' + storage.uid, function(data){
        console.log("---- COLLECTION CHANGE: incoming request ------" );
        console.log(JSON.stringify(data));
        storage.newIncomingRequest(data);
    });
    // Listening for change of state of outgoing requests
    socket.on('outgoingRequest:' + storage.uid, function(data){
        console.log("---- COLLECTION CHANGE: outgoing request ------" );
        console.log(JSON.stringify(data));
        storage.requestStateChanged(data);
    });
};

// Method for authenticating user against server side
communicationController.authenticateUser = function (username, password) {
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/user/login',
        data:
        {
            "username": username,
            "password": password
        },
        success: function(data)
        {
            console.log ("1. Successfull authentication");
            storage.init(data);
        },
        error: function(data){
            console.log("Authentication failed");
            showFailedAuthorizationNote();
        },
        dataType: "json"
    });
};

//Method for creating newUser account
communicationController.createNewUser = function (newContact){
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/user',
         data:
        {
           "fullName": newContact.forename + " " + newContact.surname,
           "bankAccount": newContact.bankAccount,
           "username": newContact.username,
           "password": newContact.password,
           "phoneNumber": newContact.phoneNumber,
           "pin": newContact.pin,
        },
        success: function(data)
        {
            console.log("Create new user success");
            storage.registrationOutcome = "success";
            document.querySelector('#main-navigator').resetToPage('register-outcome-template');            
        },
        error: function(data){
            console.log("Create new suer failed");
            storage.registrationOutcome = "error";
            alert(JSON.stringify(data));
            document.querySelector('#main-navigator').resetToPage('register-outcome-template');            
            //unsuccesfullRegistration();
        },
        dataType: "json"
    });
    
};

// Querring userData from server
communicationController.getUserData = function(uid){
    var deferred = $.Deferred();
    $.ajax(
    {
        type: "GET",
        url: deploydEndpoint + '/user?id=' + uid,
        success: function(data)
        {
            console.log ("2. Successfully queried user data");
            deferred.resolve(data);
        },
        error: function(data){
            console.log("User data query failed");
        },
        dataType: "json"
    });
    return deferred.promise();
};

// Changing userData on server
    communicationController.changeUserDetail = function(newName, newAccountName){
    console.log("Communication controller: CHanging user data" + id);
    //alert(newName);
     $.ajax(
    {
        type: "PUT",
        url: deploydEndpoint + '/user?id=' + id,
        data: {
            "fullName": "newName2"
        },
        success: function(data)
        {
            console.log("3. Succesfully queried App data: ");
            storage.updateUserDetail(newName, "Ucet");
        },
        error: function(data){
            console.log("Loading loadApplicationData failed");
        },
        dataType: "json"
    });
};

//Method for retrieving contactList from server
communicationController.loadApplicationData = function(id, contactList){
    console.log("Loading application data: " + id);
    var deferred = $.Deferred();
    $.ajax(
    {
        type: "PUT",
        url: deploydEndpoint + '/user?id=' + id,
        data: {
            "contactList": contactList
        },
        success: function(data)
        {
            console.log("3. Succesfully queried App data: ");
            deferred.resolve(data);
        },
        error: function(data){
            console.log("Loading loadApplicationData failed");
            alert(JSON.stringify(data));
        },
        dataType: "json"
    });
    return deferred.promise();
};

// Method for submitting new transaction
communicationController.persistTransaction = function (collection) {
    console.log("CommunicationController: Persisiting transaction");
    var deferred = $.Deferred();
    var contraAccount = storage.newTransaction;
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/' + collection,
        data:
        {
            "initiator": storage.userData.id,
            "initiatorDetail": {
                "fullName": storage.userData.fullName,
                "phone": storage.userData.phoneNumber
            },
            "reciever": contraAccount.reciever,
            "recieverDetail": {
                "fullName": contraAccount.recieverDetail.fullName,
                "phone": contraAccount.recieverDetail.phone
            },
            "amount": contraAccount.amount,
            "message": contraAccount.message,
            "submitDate": Date.now()
        },
        success: function(data)
        {
            console.log("Conttroller: Persisted new transaction");
            deferred.resolve(data);
        },
        error: function(data)
        {
            console.log("Persisting payment failed");
            alert(data);
        },
        dataType: "json"
    });
    return deferred.promise();

};

//Method for changing state of request in persistence
communicationController.changeRequestState = function(dataSource, newState) {
    var deferred = $.Deferred();
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/request/' + dataSource.id,
        data:
        {
            "state": newState
        },
        success: function(data)
        {
            deferred.resolve(data);

        },
        dataType: "json"
    });
    return deferred.promise();
    
};

// Method for completing request - changing state and linking new payment
communicationController.completeRequest = function(requestId, payment){
    $.ajax(
    {
        type: "PUT",
        url: deploydEndpoint + '/request?id=' + requestId,
        data:
        {
            "state": "completed",
            "payment": payment
        },
        success: function(data)
        {
            console.log("Request succesfully completed");
        },
        dataType: "json"
    });
};

// Method for logging out current user
communicationController.logoutUser = function(){
    var deferred = $.Deferred();
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/user/logout',
        success: function(data)
        {
            console.log("Successfully loged out");
            deferred.resolve(data);

        },
        error: function(data){
            console.log("ERROR when logging out");
            deferred.resolve(data);
        },
        dataType: "json"
    });
    return deferred.promise();
};