// This is a JavaScript file

composeTransactionDetailPage = function () {
   document.querySelector('#transaction-party').innerHTML = storage.transaction.name;
   document.querySelector('#transaction-amount').innerHTML = storage.transaction.amount;
   document.querySelector('#transaction-state').innerHTML = storage.transaction.state;
};


//Handling content of define-transaction-page
composeDefineTransactionPage = function() {
    console.log(storage.contactList[storage.newTransactionItem].fullName);
    document.querySelector('.transaction-recievers-name').innerHTML = storage.contactList[storage.newTransactionItem].fullName;  
    document.querySelector('.transaction-recievers-phone').innerHTML = storage.contactList[storage.newTransactionItem].phoneNumber;  
};