
var accountId = 'b3162c0b1611b96e';
var storage = {
    requests: [],
    payments: [],
    userContact: {},
    account: {}
};


storage.init = function(){
    console.log("S0. Initializing storage");
    storage.getRequests();
    storage.getPayments();
    storage.getUserDetail();
    storage.getAccountDetail();
    };

storage.getUserDetail = function() {
    console.log("S9. Getting user detail from deployd.");
    $.getJSON(deploydEndpoint + '/contact?accountId=' + accountId, function(data){
        storage.userContact.fullName = data[0].fullName;
        storage.userContact.emailAddress = data[0].emailAddress;
        storage.userContact.phoneNumber = data[0].phoneNumber;
        storage.userContact.facebookUsername = data[0].facebookUsername;
    });
};

storage.getAccountDetail = function() {
    console.log("S10. Getting account detail from deployd.");
    $.getJSON(deploydEndpoint + '/account?id=' + accountId, function(data){
        storage.account.accountNumber = data.accountNumber;
        storage.account.balance = data.balance;
    });
};

storage.getRequests = function () {
    console.log("S7. Getting requests from deployd.");
    $.getJSON(deploydEndpoint + '/request?accountInitiator=' + accountId, function(data){
        $.each(data, function(index, value){
            storage.addRequest(value);
        });
    });
};

storage.getPayments = function () {
    console.log("S8. Getting payments from deployd");
    $.getJSON(deploydEndpoint + '/payment?accountInititator=' + accountId, function(data){
        $.each(data, function(index, value){
            storage.addPayment(value);
        });
    });
};

storage.addRequest = function(value){
    console.log(value);
    console.log("S1. Adding request: " + value);
    if (storage.contains(storage.requests, value.id)){
        console.log("Storage:addRequest - Cannot insert, not unique element");
    }
    else {
        storage.requests.push({
            accountInitiator: value.accountInitiator,
            accountReciever: value.accountReciever,
            amount: value.amount,
            id: value.id,
            initiator: value.initiator
        });
        storage.saveTransaction();
    }
//    billMe.showRequests();
};

storage.addPayment = function(value){
  console.log("S2. Adding payment: " + value);
    if (storage.contains(storage.payments, value.id)){
        console.log("Storage:addPayment - Cannot insert, not unique element");
    }
    else {
        storage.payments.push({
            accountInitiator: value.accountInitiator,
            accountReciever: value.accountReciever,
            amount: value.amount,
            id: value.id,
            initiator: value.initiator

        });
        storage.saveTransaction();
    }
//    billMe.showPayments();
};

storage.contains = function(collection, id){
    console.log("S3. Contains" + collection);
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
     console.log("S4. adding transaction");
    this.transactions.push({
        account: accountNumber,
        status: 'payment' 
    });
    this.saveTransaction();
    return true;
};

storage.filter = function(status){
    console.log("S5. filtering ");
    if (status === 'all') {
        return this.transactions;
        }
    return this.transactions.filter(function(item){
            return item.status === status;
        });
};

storage.remove = function(account){
    console.log("S6. Removing");
    this.transactions.forEach(function(item, i){
        if (item.account === account){
            this.transactions.splice(i, 1);
        }
    }.bind(this));
    this.saveTransaction();
    return true;
    
};