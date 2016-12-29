var payments;
var billMe = {
    filterFlag: 'all',
    events: []
};

// 1. Initialization of application, event is in this case ons-page mainHTML
document.addEventListener('init', function(event){
    //Getting Id of ons-page = "mainPage"
    console.log("1. Initializing mainPage");
    var view = event.target.id;
    if ( view === 'mainPage'){
        //Calling function of globalObject billMe.mainPageInit -> GOTO 2
        billMe[view + 'Init'](event.target);
    }
}, false);

function getTransactionList(accountId){
    console.log("4. Getting transaction list");
    $.ajax({
            type: "GET",
            url: 'http://localhost:2403/payment?initiatorAccount=' + accountId,
            dataType: "json",
            success: function(data)
            {
                payments = data;
                console.log(data);
            }
        });
    console.log("After get");
}


// 2. Global function Initialization of mainPage.html, target=ons-page mainPage.html
billMe.mainPageInit = function(target){
    console.log("2. Initialiying content of mainPage");
    // Selecting part of mainPage with id transactionList
    this.mainPage = document.querySelector('#transaction-list');
    // Selecting every ons-button in mainPage.html, and adding filter logic on them
    console.log("OK");
    //Following command serves for  advanced filtering
    /*target.querySelectorAll('ons-button').forEach (function(element){
        element.addEventListener('click', this.filter.bind(this));    
    }.bind(this));*/
    console.log("NOK");
    // Adding listener on plusButton
    target.querySelector('#plusButton').addEventListener('click', this.addTransactionPrompt.bind(this));
    target.querySelector('#payment-button').addEventListener('click', this.showPayments.bind(this));
    target.querySelector('#request-button').addEventListener('click', this.showRequests.bind(this));
    // Initializing storage
    console.log("Main page initialized");
    storage.init();
    this.refresh();
};

billMe.addTransactionPrompt = function(){
    ons.notification.prompt('Insert new Item', {
        title: 'newItem',
        cancelable: true,
        callback: function(accountNumber){
            if (accountNumber === '' || accountNumber === null){
                return;
            }
            if (storage.addTransaction(accountNumber)){
                console.log ("Adding transaction...");
                this.refresh();
            } else {
                ons.notification.alert('Failed to submit transaction');
                
            }            
        }.bind(this)
    });
};


billMe.showRequests = function(){
    console.log("5. Showing requests");
    var requests = storage.requests;
    document.querySelector('#transaction-list').innerHTML=requests.map(function(item){
        console.log(item);
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{label}}', item.amount);
            console.log("QuerySelector");
    }).join('');
    //TODO - Handle event listeners, based on required behavior
};

billMe.showPayments = function(){
   console.log("X. Showing requests");
    var payments = storage.payments;
    document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
        console.log(item);
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{label}}', item.amount);
            console.log("QuerySelector");
    }).join('');
    //TODO - Handle event listeners, based on required behavior    
};


billMe.refresh = function(){
    console.log("Refreshing");
    var items = storage.filter(this.filterFlag);
    this.mainPage.innerHTML = items.map(function(item){
        console.log(item);
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{label}}', item.account);
            console.log("QuerySelector");
    }).join('');    
    //Remove all event listeners to add them again
    var children = this.mainPage.children; //.children selects all children elements
    this.events.forEach(function(event, i){
        event.element.removeEventListener('click', event.function);
    });
    this.events = [];
    var event = {};
    items.forEach (function(item, i){
        event = {
            element: children[i].querySelector('ons-icon'),
            function: this.removeItemPrompt.bind(this, item.account)
        };
        this.events.push(event);
        event.element.addEventListener('click', event.function);
    }.bind(billMe));
};


billMe.removeItemPrompt = function(account){
    ons.notification.confirm('Would you like to remove the transaction' + account, {
        title: 'Remove item?',
        callback: function (answer){
            if (answer === 1){
                if (storage.remove(account)){
                    this.refresh();
                } else {
                    ons.notification.alert('Polozku nelze odstranit.');
                }
            }
        }.bind(this)
    });
};

billMe.filter = function(evt){
    console.log("Filtering items using transactionType...");
    this.filterFlag = evt.target.getAttribute('data-filter')||'all';
    console.log(this.filterFlag);
    this.refresh();
};