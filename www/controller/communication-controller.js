

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
    var contraAccount = storage.contactList[systemVariables.newTransactionItem];
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
            console.log("Conttroller: Persisted new transaction");
            deferred.resolve(data);
        },
        dataType: "json"
    });
    return deferred.promise();

};

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