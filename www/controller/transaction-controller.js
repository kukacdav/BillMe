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
    
};

//FIXME: Why is this not working, when return back to page after submit request 
function showPayments() {
   console.log("T2. - Showing payments");
    var payments = storage.payments;
    document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{amount}}', item.amount).replace('{{name}}', item.reciever[0].fullName)
            .replace('{{state}}', item.state.stateName);
    }).join('');
    bindEventListenersToTransactions();
    //console.log(document.querySelector('#transaction-list').innerHTML);
};


function submitTransaction() {
    console.log("T3. - Submitting transaction");
    // FIXME: SHOULD BE INDEPENDENT ON VIEW!!
    var amount = document.querySelector('#transaction-amount').value;
    var message = document.querySelector('#transaction-message').value;    
    persistTransaction(accountId, "7a5815ef7262fa55", amount, message );
    switchPage('view/html/success-submit-page.html');
};

//RemoveME
bindEventListenersToTransactions = function () {
    console.log("Binding");
    $(".transaction-item-detail").on("click", showTransactionDetail);
};

