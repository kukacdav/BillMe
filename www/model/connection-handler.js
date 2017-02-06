

persistTransaction = function (accountInitiator, accountReciever, amount, message) {
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/request?',
        data:
        {
            "accountInitiator": accountInitiator,
            "accountReciever": accountReciever,
            "amount": amount,
            "message": message,
            "submitDate": Date.now()
        },
        success: function(data)
        {
            successfullTransaction();
        },
        dataType: "json"
    });
};