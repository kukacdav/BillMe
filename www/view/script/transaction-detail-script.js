// This is a JavaScript file

composeTransactionDetailPage = function () {
   document.querySelector('#transaction-party').innerHTML = storage.transaction.name;
   document.querySelector('#transaction-amount').innerHTML = storage.transaction.amount;
   document.querySelector('#transaction-state').innerHTML = storage.transaction.state;
};


//Handling content of define-transaction-page
composeDefineTransactionPage = function() {
    if (systemVariables.transactionType === "payment")
        document.querySelector('#page-header').innerHTML = "New payment";
    else if (systemVariables.transactionType === "request")
        document.querySelector('#page-header').innerHTML = "New request";
    document.querySelector('.transaction-recievers-name').innerHTML = storage.contactList[systemVariables.newTransactionItem].fullName;  
    document.querySelector('.transaction-recievers-phone').innerHTML = storage.contactList[systemVariables.newTransactionItem].phoneNumber;  
};