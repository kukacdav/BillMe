

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
    console.log("= Altering data" + dataSource.id);
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/request/' + dataSource.id,
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
    
}