// This is a JavaScript file

// Function for filling content of elements on page transaction/payment-detail-page
composeTransactionDetailPage = function () {
    var dataSource;
    if (systemVariables.transactionType === "filter-incoming-payments") {
        dataSource = storage.incomingPayments[systemVariables.elementIndex];
        hideRequestFields();
    }
    else if (systemVariables.transactionType === "filter-outgoing-payments"){
        dataSource = storage.outgoingPayments[systemVariables.elementIndex];
        hideRequestFields();
        }
    else if (systemVariables.transactionType === "filter-outgoing-requests")
        dataSource = storage.outgoingRequests[systemVariables.elementIndex];
    else if (systemVariables.transactionType === "filter-incoming-requests")
        dataSource = storage.incomingRequests[systemVariables.elementIndex];
   document.querySelector('#transaction-party').innerHTML = dataSource.reciever[0].fullName;
   document.querySelector('#transaction-amount').innerHTML = dataSource.amount;
   document.querySelector('#transaction-state').innerHTML = dataSource.state.stateName;
   document.querySelector('#transaction-message').innerHTML = dataSource.message;
   var submitDate = new Date(dataSource.date);
   document.querySelector('#transaction-date').innerHTML = submitDate.toString('yyyy-MM-d-h-mm-ss');
};

//Function for hidding parts of ttransaction-detail-template, which should be shown only for requests
hideRequestFields = function() {
    $('#response-message-field').hide();
    $('#response-action-buttons').hide();
    
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
    if (systemVariables.newTransaction.transactionType === "payment")
        document.querySelector('#page-header').innerHTML = "New payment";
    else if (systemVariables.newTransaction.transactionType === "request")
        document.querySelector('#page-header').innerHTML = "New request";
};



//Function for composing dynamic parts of page
composeMainPage = function(page) {
        page.querySelector('#account-name').innerHTML = storage.account.accountName;
        page.querySelector('#account-number').innerHTML = storage.account.accountNumber;
        page.querySelector('#account-balance').innerHTML = storage.account.balance + " Kč";
        page.querySelector('#create-payment-button').onclick = function(){systemVariables.newTransaction.transactionType="payment";switchPage('view/html/contact-list-page.html');};
        page.querySelector('#create-request-button').onclick = function(){systemVariables.newTransaction.transactionType="request";switchPage('view/html/contact-list-page.html');};
        page.querySelector('#incoming-payments-filter').onclick = function(){activateIncomingPayments();showIncomingPayments();};
        page.querySelector('#outgoing-payments-filter').onclick = function(){activateOutgoingPayments();showOutgoingPayments();};
        page.querySelector('#unresolved-transactions-filter').onclick = function(){activateUnresolvedTransactions(); showRequests();};
        showIncomingPayments();
      document.querySelector('#pageNavigator').addEventListener('prepop', function(event) {
        if(event.currentPage.id === "contact-list-page") {
            document.getElementById('tabbar').setTabbarVisibility(true);
        }
    });
      
};

composeContactListPage = function(page) {
      document.getElementById('tabbar').setTabbarVisibility(false);
    showContactList();
    console.log("Composing contact list page");
    $(".contact-list-detail").on("click", showContactListDetail);
    if (systemVariables.newTransaction.transactionType === "payment"){
        document.querySelector('#page-title').innerHTML = "Přímá platba";
    }
    else if (systemVariables.newTransaction.transactionType === "request"){
        document.querySelector('#page-title').innerHTML = "Připomínka";
    }
    else
        console.log("Something went wrong");
};

composePhoneContactsPage = function() {
    showContactList();

};

composeSetAmountPage = function() {
    //TMP
    console.log("this " + systemVariables.newTransaction.contraAccountNumber);
    console.log("this " + systemVariables.newTransaction.contraAccountId);
    //END
    document.querySelector('#input-amount').focus();
    document.querySelector('#recievers-name').innerHTML = storage.contactList[systemVariables.newTransactionItem].fullName;  
    document.querySelector('#recievers-phone').innerHTML = storage.contactList[systemVariables.newTransactionItem].phoneNumber;  
    document.querySelector('#recievers-email').innerHTML = storage.contactList[systemVariables.newTransactionItem].emailAddress;  
    document.querySelector('#input-amount').onchange = function(){controlAmountInput()};
    document.querySelector('#submit-transaction-button').onclick = function(){switchPage('view/html/confirm-transaction-page.html')};
};


controlAmountInput = function() {
  var amount = document.querySelector('#input-amount').value;
  if ( $.isNumeric(amount) && amount > 0 ){
    document.querySelector('#submit-transaction-button').disabled=false;
        $('#input-amount').removeClass("incorrect-input-field");
        $('#input-amount').addClass("correct-input-field");
        systemVariables.newTransaction.amount = amount; 
    console.log("je cislo");
  }
    else{
        document.querySelector('#submit-transaction-button').disabled=true;
        console.log("neni uplne");
        $('#input-amount').removeClass("correct-input-field");
        $('#input-amount').addClass("incorrect-input-field");
    }
};

composeConfirmTransactionPage = function() {
    if (systemVariables.newTransaction.transactionType === "payment")
        composeConfirmTransactionPaymentPage();
    else 
        composeConfirmTransactionRequestPage();
    document.querySelector('#recievers-name2').innerHTML = storage.contactList[systemVariables.newTransactionItem].fullName;  
    document.querySelector('#recievers-phone2').innerHTML = storage.contactList[systemVariables.newTransactionItem].phoneNumber;  
    document.querySelector('#recievers-email2').innerHTML = storage.contactList[systemVariables.newTransactionItem].emailAddress;  
    document.querySelector('#transaction-amount').innerHTML = systemVariables.newTransaction.amount+ " Kč";
    document.querySelector('#submit-button').onclick = function(){storeMessage(); submitTransaction();};
};

composeConfirmTransactionPaymentPage = function(){
    document.querySelector('#page-header').innerHTML = confirmTransactionPaymentHeader;
    document.querySelector('#transaction-amount-header').innerHTML = paymentAmountHeader;    
document.querySelector('#submit-button').innerHTML = submitPaymentButton;
};

composeConfirmTransactionRequestPage = function(){
    document.querySelector('#page-header').innerHTML = confirmTransactionRequestHeader;
    document.querySelector('#transaction-amount-header').innerHTML = requestAmountHeader;    
    document.querySelector('#submit-button').innerHTML = submitRequestButton;
};

composeSuccessSubmitPage = function() {
    if (systemVariables.newTransaction.transactionType === "payment"){
        document.querySelector('#success-submit-header').innerHTML = successSubmitHeaderPayment;
        document.querySelector('#success-submit-message').innerHTML = successSubmitMessagePayment;
    }
    else {
        document.querySelector('#success-submit-header').innerHTML = successSubmitHeaderRequest;
        document.querySelector('#success-submit-message').innerHTML = successSubmitMessageRequest;
    }
    document.querySelector('#transaction-success-button').onclick = function(){document.querySelector('#pageNavigator').resetToPage('main-page-template');
        };
    
};


storeMessage = function(){
  var message = document.querySelector('#message-input').value;
    if (message == null)
        systemVariables.newTransaction.message = "";
    else
        systemVariables.newTransaction.message = message;
};



