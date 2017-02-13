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
    if (storage.incomingRequests.length === 0)
        return;
        var counter = -1;
    document.querySelector('#transaction-list').innerHTML="<ons-list-header>Přijaté připomínky</ons-list-header>";
    var requests = storage.incomingRequests;
    document.querySelector('#transaction-list').innerHTML+=requests.map(function(item){
                 counter++;

        return "<ons-list-item id='filter-incoming-requests' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.reciever[0].fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state.stateName + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
};

showOutgoingRequests = function() {
    if (storage.outgoingRequests.length === 0)
        return;
        var counter = -1;
    var requests = storage.outgoingRequests;
    document.querySelector('#transaction-list').innerHTML+="<ons-list-header>Odeslané připomínky</ons-list-header>";
    document.querySelector('#transaction-list').innerHTML+=requests.map(function(item){
                 counter++;

        return "<ons-list-item id='filter-outgoing-requests' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.reciever[0].fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state.stateName + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
};

function showIncomingPayments() {
   console.log("T2. - Showing payments");
    var payments = storage.incomingPayments;
    var counter = -1;
    systemVariables.filterFlag = "incomingPayments";
    console.log(payments);
    console.log(document.querySelector('#transaction-list'));
     document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
         counter++;
        return "<ons-list-item id='filter-incoming-payments' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.reciever[0].fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state.stateName + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
    $(".transaction-item-detail").on("click", showTransactionDetail);
};

function showOutgoingPayments() {
   console.log("T2. - Showing outgoing payments");
   systemVariables.filterFlag = "outgoingPayments";
    var payments = storage.outgoingPayments;
    var counter = -1;
    console.log(payments);
    console.log(document.querySelector('#transaction-list'));
    document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
                 counter++;
        return "<ons-list-item id='filter-outgoing-payments' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.reciever[0].fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state.stateName + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');    
    $(".transaction-item-detail").on("click", showTransactionDetail);
    $(".transaction-amount").addClass("red");
};

function submitTransaction() {
    console.log("T3. - Submitting transaction");
    if (systemVariables.newTransaction.transactionType === "payment")
        persistPayment();
    else if (systemVariables.newTransaction.transactionType === "request")
        persistRequest();
    else 
        console.log("Unexpected ERROR, while persisting new transaction: unknown transactionType");
};

function rejectSelectedRequest() {
    if (systemVariables.transactionType === "filter-outgoing-requests")
        dataSource = storage.outgoingRequests[systemVariables.elementIndex];
    else if (systemVariables.transactionType === "filter-incoming-requests")
        dataSource = storage.incomingRequests[systemVariables.elementIndex];
    newState = 'e5479995d9eb08c3';
    alterRequestInPersistence(dataSource, newState);
    
};

function acceptSelectedRequest(){
    
};

function requestStateAltered() {
    console.log("Table altered");
    storage.incomingRequests.splice(0,storage.incomingRequests.length);
    console.log(storage.incomingRequests);
    storage.getIncomingRequests();
    console.log(storage.incomingRequests);
    document.querySelector('#pageNavigator').resetToPage('main-page-template');
};
