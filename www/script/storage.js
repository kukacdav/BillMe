var accountId = 'b3162c0b1611b96e';
var storage = {
    transactions: [],
    requests: [],
    payments: []
};

storage.init = function(){
    console.log("3. Initializing storage");
    var transactionList = getTransactionList(accountId);
    // Querring requests 
    $.getJSON(deploydEndpoint + '/request?accountInitiator=' + accountId, function(data){
        $.each(data, function(index, value){
            storage.addRequest(value);
        });
    });
    // Querring payments
    $.getJSON(deploydEndpoint + '/payment?accountInititator=' + accountId, function(data){
        $.each(data, function(index, value){
            storage.addPayment(value);
        });
    });
};

storage.addRequest = function(value){
    console.log("4. Adding request: " + value);
    if (storage.contains(storage.requests, value.id)){
        console.log("Storage:addRequest - Cannot insert, not unique element");
    }
    else {
        storage.requests.push({
            accountInitiator: value.accountInitiator,
            accountReciever: value.accountReciever,
            amount: value.amount,
            id: value.id
        });
        storage.saveTransaction();
    }
    billMe.showRequests();
};

storage.addPayment = function(value){
  console.log("X. Adding payments: " + value);
    if (storage.contains(storage.payments, value.id)){
        console.log("Storage:addPayment - Cannot insert, not unique element");
    }
    else {
        storage.payments.push({
            accountInitiator: value.accountInitiator,
            accountReciever: value.accountReciever,
            amount: value.amount,
            id: value.id
        });
        storage.saveTransaction();
    }
    billMe.showPayments();
};

storage.contains = function(collection, id){
    console.log("Contains" + collection);
    $.each(collection, function(index, id){
        if (index.id == id)
            return true;
    });
    return false;
};
storage.saveTransaction = function(){
    //TODO: Handle persisting datas in device memory
    //localStorage.setItem('billMe', JSON.stringify(this.transactions));
};

storage.addTransaction = function(accountNumber){
    this.transactions.push({
        account: accountNumber,
        status: 'payment' 
    });
    this.saveTransaction();
    return true;
};

storage.filter = function(status){
    console.log("Filtering..");
    if (status === 'all') {
        return this.transactions;
        }
        return this.transactions.filter(function(item){
            return item.status === status;
        });
};

storage.remove = function(account){
    this.transactions.forEach(function(item, i){
        if (item.account === account){
            this.transactions.splice(i, 1);
        }
    }.bind(this));
    this.saveTransaction();
    return true;
    
};