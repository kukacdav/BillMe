var sid;

changeAccountBalance = function () {

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

