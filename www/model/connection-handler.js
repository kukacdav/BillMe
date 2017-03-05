var sid;

changeAccountBalance = function () {

};

authenticateUser = function (username, password) {
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
            console.log ("Successfull authentication");
            console.log("sessionId: " + data.id);
            sid = data.id;
            storage.uid = data.uid;
            storage.init();
            document.querySelector('#tabbar').setActiveTab(1);
            },
        error: function(data){
            console.log("Authentication failed");
            showFailedAuthorizationNote();
        },
        dataType: "json"
    });
};

getUserData = function(){
    $.ajax(
    {
        type: "GET",
        url: deploydEndpoint + '/user?id=' + storage.uid,
        success: function(data)
        {
            console.log(data);
            console.log ("Successfully queried user data");
            storage.userData = data;
            console.log(storage.userData);
            storage.dataLoaded = true;
            composeMainPages();
        },
        error: function(data){
            console.log("User data query failed");
        },
        dataType: "json"
    });
};

loadContactList = function(){
    $.ajax(
    {
        type: "GET",
        url: deploydEndpoint + '/user?{"$fields":{"bankAccount.accountBalance": 0, "bankAccount.accountName": 0}}',
        success: function(data)
        {
            storage.contactList = data;
            console.log("Contact list: " + storage.contactList);
        },
        error: function(data){
            console.log("User data query failed");
        },
        dataType: "json"
    });
};


persistPayment = function () {
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/payment?',
        data:
        {
            "accountInitiator": storage.account.accountId,
            "accountReciever": systemVariables.newTransaction.contraAccountId,
            "amount": systemVariables.newTransaction.amount,
            "message": systemVariables.newTransaction.message,
            "submitDate": Date.now(),
            "state": "8c35dc706cccbba6"
        },
        success: function(data)
        {
            successfullPayment();
        },
        dataType: "json"
    });
};

persistRequest = function () {
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/request?',
        data:
        {
            "accountInitiator": storage.account.accountId,
            "accountReciever": systemVariables.newTransaction.contraAccountId,
            "amount": systemVariables.newTransaction.amount,
            "message": systemVariables.newTransaction.message,
            "submitDate": Date.now(),
            "state": "8c35dc706cccbba6"
        },
        success: function(data)
        {
            successfullRequest();
        },
        dataType: "json"
    });
};

getContraAccount = function(){
    console.log("= getting data");
     $.getJSON(deploydEndpoint + '/contact?phoneNumber=' + storage.contactList[systemVariables.newTransactionItem].phoneNumber, function(data){
        systemVariables.newTransaction.contraAccountId = data[0].accountId;
        systemVariables.newTransaction.contraAccountNumber = data[0].accountNumber;
    });
};

alterRequestInPersistence = function(dataSource, newState) {
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
            requestStateAltered();
        },
        dataType: "json"
    });
    
};

completeRequest = function(paymentId, dataSource, newState){
     $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/request/' + dataSource.id,
        data:
        {
            "state": newState,
            "payment": paymentId
        },
        success: function(data)
        {
            paymentToRequestSuccessfull();
        },
        dataType: "json"
    });   
};


createLinkedPayment = function (dataSource, newState) {
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/payment?',
        data:
        {
            "accountInitiator": storage.account.accountId,
            "accountReciever": systemVariables.newTransaction.contraAccountId,
            "amount": systemVariables.newTransaction.amount,
            "message": systemVariables.newTransaction.message,
            "submitDate": Date.now(),
            "state": "8c35dc706cccbba6"
        },
        success: function(data)
        {
            completeRequest(data.id, dataSource, newState);
        },
        dataType: "json"
    });
};

changeAccountBalance = function(account, amount){
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/account/' + account,
        data:
        {
            "balance": {$inc: amount}
        },
        success: function(data)
        {
                console.log("Account Balance Changed Successfully");
        },
        dataType: "json"
    });
};
