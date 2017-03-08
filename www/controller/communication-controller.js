

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

//Method for retrieving contactList from server
communicationController.loadContactList = function(){
    var deferred = $.Deferred();
    $.ajax(
    {
        type: "GET",
        url: deploydEndpoint + '/user?{"$fields":{"bankAccount.accountBalance": 0, "bankAccount.accountName": 0}}',
        success: function(data)
        {
            console.log("3. Succesfully queried contactList.");
            deferred.resolve(data);
        },
        error: function(data){
            console.log("User data query failed");
        },
        dataType: "json"
    });
    return deferred.promise();
};

// Method for submitting new transaction
communicationController.persistTransaction = function (collection) {
    var deferred = $.Deferred();
    var contraAccount = systemVariables.newTransaction;
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/' + collection,
        data:
        {
            "initiator": storage.userData.id,
            "initiatorDetail": {
                "fullName": storage.userData.fullName,
                "phone": storage.userData.contact.phone,
                "email":storage.userData.contact.email,
                "facebook":storage.userData.contact.facebook
            },
            "reciever": contraAccount.reciever,
            "recieverDetail": {
                "fullName": contraAccount.recieverDetail.fullName,
                "phone": contraAccount.recieverDetail.phone,
                "email":contraAccount.recieverDetail.email,
                "facebook":contraAccount.recieverDetail.facebook
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

//TODO: REMOVEME<
persistRequest = function () {
    var contraAccount = storage.contactList[systemVariables.newTransactionItem];
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/request',
        data:
        {
            "initiator": storage.userData.id,
            "initiatorDetail": {
                "fullName": storage.userData.fullName,
                "phone": storage.userData.contact.phone,
                "email":storage.userData.contact.email,
                "facebook":storage.userData.contact.facebook
            },
            "reciever": contraAccount.id,
            "recieverDetail": {
                "fullName": contraAccount.fullName,
                "phone": contraAccount.contact.phone,
                "email":contraAccount.contact.email,
                "facebook":contraAccount.contact.facebook
            },
            "amount": systemVariables.newTransaction.amount,
            "message": systemVariables.newTransaction.message,
            "submitDate": Date.now()
        },
        success: function(data)
        {
            successfullRequest();
        },
        dataType: "json"
    });
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