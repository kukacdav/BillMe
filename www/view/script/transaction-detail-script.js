// This is a JavaScript file

// Function for filling content of elements on page transaction/payment-detail-page
composeTransactionDetailPage = function () {
   document.querySelector('#transaction-party').innerHTML = storage.transaction.name;
   document.querySelector('#transaction-amount').innerHTML = storage.transaction.amount;
   document.querySelector('#transaction-state').innerHTML = storage.transaction.state;
};

// Function for filling content of elements on page request-detail-page
composeRequestDetailPage = function () {
   document.querySelector('#request-party').innerHTML = storage.transaction.name;
   document.querySelector('#request-amount').innerHTML = storage.transaction.amount;
   document.querySelector('#request-state').innerHTML = storage.transaction.state;
   document.querySelector('#cancel-button').addEventListener('click', alert.log("Prompt cancel"));
   document.querySelector('#accept-button').addEventListener('click', alert.log("Prompt accept"));
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

//Function for composing dynamic parts of page
composeMainPage = function(page) {
        page.querySelector('#account-name').innerHTML = storage.account.accountName;
        page.querySelector('#account-number').innerHTML = storage.account.accountNumber;
        page.querySelector('#account-balance').innerHTML = storage.account.balance + " Kč";
        page.querySelector('#create-payment-button').onclick = function(){systemVariables.transactionType="payment";switchPage('view/html/contact-list-page.html');};
        page.querySelector('#create-request-button').onclick = function(){systemVariables.transactionType="request";switchPage('view/html/contact-list-page.html');};
        page.querySelector('#incoming-payments-filter').onclick = function(){activateIncomingPayments();showIncomingPayments();};
        page.querySelector('#outgoing-payments-filter').onclick = function(){activateOutgoingPayments();showOutgoingPayments();};
        page.querySelector('#unresolved-transactions-filter').onclick = function(){activateUnresolvedTransactions(); showRequests();};
        attachTabbarListeners();
        showIncomingPayments();
};

composeContactListPage = function(page) {
    showContactList();
    console.log("Composing contact list page");
    $(".contact-list-detail").on("click", showContactListDetail);
    if (systemVariables.transactionType === "payment"){
        document.querySelector('#page-title').innerHTML = "Přímá platba";
    }
    else if (systemVariables.transactionType === "request"){
        document.querySelector('#page-title').innerHTML = "Připomínka";
    }
    else
        console.log("Something went wrong");
};

composePhoneContactsPage = function() {
    attachTabbarListeners();
    showContactList();

};

composeSetAmountPage = function() {
    
    
};