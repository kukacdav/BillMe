// Transaction-controller
// author: David Kukacka

// Transaction controller handle all logic asosiated with trasnactions - requests and payments

function showRequests()  {
    console.log("T1. - Showing requests");
    document.querySelector('#transaction-list').innerHTML="";
    systemVariables.filterFlag = "requests";
    showIncomingRequests();
    showOutgoingRequests();
    console.log(storage.incomingRequests);
    $(".transaction-item-detail").on("click", showTransactionDetail);
};

showIncomingRequests = function() {
    if (storage.userData.incomingRequests.length === 0)
        return;
        var counter = -1;
    document.querySelector('#transaction-list').innerHTML="<ons-list-header>Přijaté připomínky</ons-list-header>";
    var requests = storage.userData.incomingRequests;
    document.querySelector('#transaction-list').innerHTML+=requests.map(function(item){
                 counter++;

        return "<ons-list-item id='filter-incoming-requests' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.initiatorDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
};

showOutgoingRequests = function() {
    if (storage.userData.outgoingRequests.length === 0)
        return;
        var counter = -1;
    var requests = storage.userData.outgoingRequests;
    document.querySelector('#transaction-list').innerHTML+="<ons-list-header>Odeslané připomínky</ons-list-header>";
    document.querySelector('#transaction-list').innerHTML+=requests.map(function(item){
                 counter++;

        return "<ons-list-item id='filter-outgoing-requests' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.recieverDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
};

function showIncomingPayments() {
   console.log("T2. - Showing payments");
    var payments = storage.userData.incomingPayments;
    var counter = -1;
    systemVariables.filterFlag = "incomingPayments";
    console.log(payments);
    console.log(document.querySelector('#transaction-list'));
     document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
         counter++;
        return "<ons-list-item id='filter-incoming-payments' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.recieverDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
    $(".transaction-item-detail").on("click", showTransactionDetail);
};

function showOutgoingPayments() {
   console.log("T2. - Showing outgoing payments");
   systemVariables.filterFlag = "outgoingPayments";
    var payments = storage.userData.outgoingPayments;
    var counter = -1;
    console.log(payments);
    console.log(document.querySelector('#transaction-list'));
    document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
                 counter++;
        return "<ons-list-item id='filter-outgoing-payments' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.recieverDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');    
    $(".transaction-item-detail").on("click", showTransactionDetail);
    $(".transaction-amount").addClass("red");
};

function submitTransaction() {
    console.log("T3. - Submitting transaction");
    if (systemVariables.newTransaction.transactionType === "payment"){
        persistPayment();
    }
    else if (systemVariables.newTransaction.transactionType === "request")
        persistRequest();
    else 
        console.log("Unexpected ERROR, while persisting new transaction: unknown transactionType");
};

function buildRespondPayment(dataSource) {
    console.log("Building transaction: " + systemVariables.newTransaction);
    console.log("data Source: " + dataSource);
    systemVariables.newTransaction.transactionType = "payment";
    systemVariables.newTransaction.contraAccountId = dataSource.accountInitiator;
    systemVariables.newTransaction.amount = -1*(dataSource.amount);
    console.log(document.querySelector('#response-message-input').value);
    systemVariables.newTransaction.message = document.querySelector('#response-message-input').value;
}

function acceptSelectedRequest(newState) {
    dataSource = storage.incomingRequests[systemVariables.elementIndex];
    buildRespondPayment(dataSource);
    changeAccountBalance(dataSource.accountInitiator, dataSource.amount);
    changeAccountBalance(storage.account.accountId, (-1)*(dataSource.amount));
    createLinkedPayment(dataSource, newState);    
}


function cancelSelectedRequest(newState) {
    if (systemVariables.transactionType === "filter-outgoing-requests")
        dataSource = storage.outgoingRequests[systemVariables.elementIndex];
    else if (systemVariables.transactionType === "filter-incoming-requests")
        dataSource = storage.incomingRequests[systemVariables.elementIndex];
    alterRequestInPersistence(dataSource, newState);
}

function rejectSelectedRequest(newState) {
    if (systemVariables.transactionType === "filter-outgoing-requests")
        dataSource = storage.outgoingRequests[systemVariables.elementIndex];
    else if (systemVariables.transactionType === "filter-incoming-requests")
        dataSource = storage.incomingRequests[systemVariables.elementIndex];
    alterRequestInPersistence(dataSource, newState);
}

function requestStateAltered() {
    console.log("Table altered");
    if (systemVariables.transactionType === "filter-outgoing-requests"){
        storage.outgoingRequests.splice(0,storage.outgoingRequests.length);
        storage.getOutgoingRequests();
    }
    if (systemVariables.transactionType === "filter-incoming-requests"){
        storage.incomingRequests.splice(0,storage.incomingRequests.length);
        storage.getIncomingRequests();
    }
    document.querySelector('#pageNavigator').resetToPage('main-page-template');
};

paymentToRequestSuccessfull = function() {
    storage.incomingRequests.splice(0,storage.incomingRequests.length);
    storage.getIncomingRequests();
    storage.incomingPayments.splice(0,storage.incomingPayments.length);
    storage.getIncomingPayments();
    storage.getAccountDetail();
    switchPage('view/html/success-submit-page.html');

};

successfullPayment = function () {
    getUserData();
    systemVariables.clearOut();
    switchPage('view/html/success-submit-page.html');

};
successfullRequest = function () {
    getUserData();
    systemVariables.clearOut();
    switchPage('view/html/success-submit-page.html');
};
