// Transaction-controller
// author: David Kukacka

// Transaction controller handle all logic asosiated with trasnactions - requests and payments

function showRequests()  {
    console.log("T1. - Showing requests");
    var requests = storage.requests;
    document.querySelector('#transaction-list').innerHTML=requests.map(function(item){
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{amount}}', item.amount).replace('{{name}}', item.reciever[0].fullName)
            .replace('{{state}}', item.state.stateName);
    }).join('');
    $(".transaction-item-detail").on("click", showTransactionDetail);
};

function showIncomingPayments() {
   console.log("T2. - Showing payments");
    var payments = storage.incomingPayments;
    console.log(payments);
    //$('#transaction-list').empty();
    console.log(document.querySelector('#transaction-list'));
    document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{amount}}', item.amount + " Kč").replace('{{name}}', item.reciever[0].fullName)
            .replace('{{state}}', item.state.stateName);
    }).join('');
    $(".transaction-item-detail").on("click", showTransactionDetail);
};

function showOutgoingPayments() {
   console.log("T2. - Showing payments");
    var payments = storage.outgoingPayments;
    console.log(payments);
    //$('#transaction-list').empty();
    console.log(document.querySelector('#transaction-list'));
    document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{amount}}', "-" + item.amount + " Kč").replace('{{name}}', item.reciever[0].fullName)
            .replace('{{state}}', item.state.stateName);
    }).join('');
    $(".transaction-item-detail").on("click", showTransactionDetail);
    $(".transaction-amount").addClass("red");
};

function submitTransaction() {
    console.log("T3. - Submitting transaction");
    var amount = document.querySelector('#transaction-amount').value;
    var message = document.querySelector('#transaction-message').value;    
    persistTransaction(accountId, "7a5815ef7262fa55", amount, message );
    // Add new transaction (request/payment)
};

