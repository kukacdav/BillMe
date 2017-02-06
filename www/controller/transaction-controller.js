// Transaction-controller
// author: David Kukacka

// Transaction controller handle all logic asosiated with trasnactions - requests and payments

function showRequests()  {
    console.log("T1. - Showing requests");
    var requests = storage.requests;
     document.querySelector('#transaction-list').innerHTML=requests.map(function(item){
        return "<ons-list-item class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.reciever[0].fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state.stateName + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        </ons-list-item>";
    }).join('');
    $(".transaction-item-detail").on("click", showTransactionDetail);
};

function showIncomingPayments() {
   console.log("T2. - Showing payments");
    var payments = storage.incomingPayments;
    console.log(payments);
    console.log(document.querySelector('#transaction-list'));
     document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
        return "<ons-list-item class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.reciever[0].fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state.stateName + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        </ons-list-item>";
    }).join('');
    $(".transaction-item-detail").on("click", showTransactionDetail);
};

function showOutgoingPayments() {
   console.log("T2. - Showing outgoing payments");
    var payments = storage.outgoingPayments;
    console.log(payments);
    console.log(document.querySelector('#transaction-list'));
    document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
        return "<ons-list-item class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.reciever[0].fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state.stateName + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
        </ons-list-item>";
    }).join('');    
    $(".transaction-item-detail").on("click", showTransactionDetail);
    $(".transaction-amount").addClass("red");
};

function submitTransaction() {
    console.log("T3. - Submitting transaction");
    if (systemVariables.newTransaction.transactionType === "payment")
        persistPayment();
    else if (systemVariables.newTransaction.transactionType === "reuqest")
        persistRequest();
    else 
        console.log("Unexpected ERROR, while persisting new transaction: unknown transactionType");
};

