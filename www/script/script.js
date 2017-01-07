var payments;
var billMe = {
    filterFlag: 'all',
    events: []
};
var firstLoaded = 'true';

// 1. Initialization of application, event is in this case ons-page mainHTML
document.addEventListener('init', function(event){
    //Getting Id of ons-page = "mainPage"
    console.log("A1. Calling initializing page: " + event.target.id);
    var view = event.target.id;
    if ( view === 'mainPage'){
        //Calling function of globalObject billMe.mainPageInit -> GOTO 2
        billMe[view + 'Init'](event.target);
    }
}, false);

// 2. Global function Initialization of mainPage.html, target=ons-page mainPage.html
billMe.mainPageInit = function(target){
    console.log("A2. Initializing page:" + target);
    // Selecting part of mainPage with id transactionList
    this.mainPage = document.querySelector('#transaction-list');
    
    // Selecting every ons-button in mainPage.html, and adding filter logic on them
    //Following command serves for  advanced filtering
    /*target.querySelectorAll('ons-button').forEach (function(element){
        element.addEventListener('click', this.filter.bind(this));    
    }.bind(this));*/
    // Adding listener on plusButton
    
    target.querySelector('#payment-button').addEventListener('click', this.showPayments.bind(this));
    target.querySelector('#request-button').addEventListener('click', this.showRequests.bind(this));
    // Initializing storage
    if ( firstLoaded == 'true') {
        storage.init();    
        firstLoaded = 'false';
    }
    this.refresh();
};

/* OBSOLETE
function getTransactionList(accountId){
    console.log("T1. Getting transaction list");
    $.ajax({
            type: "GET",
            url: deploydEndpoint + '/payment?initiatorAccount=' + accountId,
            dataType: "json",
            success: function(data) {
                payments = data;
            }
        });
}*/

billMe.showRequests = function(){
    console.log("B1. Showing requests");
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
   console.log("B2. Showing payments");
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
    console.log("B3. Refreshing");
    var items = storage.filter(this.filterFlag);
    this.mainPage.innerHTML = items.map(function(item){
        console.log(item);
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{label}}', item.account);
            console.log("QuerySelector");
    }).join('');    
    //Remove all event listeners to add them again
    /*var children = this.mainPage.children; //.children selects all children elements
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
    }.bind(billMe));*/
};


billMe.filter = function(evt){
    console.log("B4. filtering");
    this.filterFlag = evt.target.getAttribute('data-filter')||'all';
    console.log(this.filterFlag);
    this.refresh();
};