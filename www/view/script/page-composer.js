// This is a JavaScript file


// Function for filling content of elements on page transaction/payment-detail-page
composeTransactionDetailPage = function () {
    var dataSource;
    if (systemVariables.transactionType === "filter-incoming-payments") {
        dataSource = storage.incomingPayments[systemVariables.elementIndex];
        hideIncomingRequestFields();
        hideOutgoingRequestFields();
    }
    else if (systemVariables.transactionType === "filter-outgoing-payments"){
        dataSource = storage.outgoingPayments[systemVariables.elementIndex];
        hideIncomingRequestFields();
        hideOutgoingRequestFields();
        }
    else if (systemVariables.transactionType === "filter-outgoing-requests"){
        hideIncomingRequestFields();
        dataSource = storage.outgoingRequests[systemVariables.elementIndex];
        document.querySelector('#transaction-party').innerHTML = dataSource.reciever[0].fullName;
    }
    else if (systemVariables.transactionType === "filter-incoming-requests"){
        dataSource = storage.incomingRequests[systemVariables.elementIndex];
        document.querySelector('#transaction-party').innerHTML = dataSource.initiator[0].fullName;
        hideOutgoingRequestFields();
    }
   
   document.querySelector('#transaction-amount').innerHTML = dataSource.amount;
   document.querySelector('#transaction-state').innerHTML = dataSource.state.stateName;
   document.querySelector('#transaction-message').innerHTML = dataSource.message;
   var submitDate = new Date(dataSource.date);
   document.querySelector('#transaction-date').innerHTML = submitDate.toString('yyyy-MM-d-h-mm-ss');
};

//Function for hidding parts of ttransaction-detail-template, which should be shown only for requests
hideIncomingRequestFields = function() {
    $('#response-message-field').hide();
    $('#incoming-requests-action-buttons').hide();
};

hideOutgoingRequestFields = function() {
    $('#outgoing-requests-action-buttons').hide();
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

};




composeContactListPage = function(page) {

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
    document.querySelector('#recievers-phone').innerHTML = storage.contactList[systemVariables.newTransactionItem].contact.phone;  
    document.querySelector('#recievers-email').innerHTML = storage.contactList[systemVariables.newTransactionItem].contact.email;  
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
    
};





composeMoreOptionsPage = function() {
   
};





function composeUserDetailPage() {
    document.querySelector('#username-line').innerHTML = storage.userData.fullName;
    document.querySelector('#phone-number-line').innerHTML = storage.userData.contact.phone;
    document.querySelector('#email-line').innerHTML = storage.userData.contact.email;
    document.querySelector('#facebook-contact-line').innerHTML = storage.userData.contact.facebook;
}

