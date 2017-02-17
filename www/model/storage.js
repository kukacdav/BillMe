
var accountId = 'b3162c0b1611b96e';
var storage = {
    incomingRequests: [],
    outgoingRequests: [],
    incomingPayments: [],
    outgoingPayments: [],
    userContact: {},
    account: {},
    transaction: {},
    contactList: [],
};
var systemVariables = {
    newTransaction: {}
};

storage.init = function(){
    console.log("S0. Initializing storage");
    storage.getIncomingRequests();
    storage.getOutgoingRequests();
    storage.getOutgoingPayments();
    storage.getIncomingPayments();
    storage.getUserDetail();
    storage.getAccountDetail();
    //TMP, mocking contact data
    storage.getContactList();
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

//Temporary function for mocking contact list
storage.getContactList = function()
{
    $.getJSON(deploydEndpoint + '/contact?', function(data)
    {
        $.each(data, function(index, value)
        {
            console.log(index);
            storage.contactList.push(
            {
                fullName: data[index].fullName,
                emailAddress: data[index].emailAddress,
                phoneNumber: data[index].phoneNumber,
                facebookUsername: data[index].facebookUsername,
                accountId: data[index].accountId
            });
        });
    });
};

storage.getAccountDetail = function() {
    console.log("S10. Getting account detail from deployd.");
    $.getJSON(deploydEndpoint + '/account?id=' + accountId, function(data){
        storage.account.accountNumber = data.accountNumber;
        storage.account.balance = data.balance;
        storage.account.accountName = data.accountName;
    });
    storage.account.accountId = accountId;
};

storage.getIncomingRequests = function() {
   console.log("S11. Getting unresolved incoming requests from deployd.");
    $.getJSON(deploydEndpoint + '/request?{"accountReciever": "' + accountId + '", "state": "8c35dc706cccbba6"}', function(data){
        $.each(data, function(index, value){
            storage.addIncomingRequest(value);
        });
    });
};

storage.getOutgoingRequests = function() {
    console.log("S11. Getting unresolved incoming requests from deployd.");
    $.getJSON(deploydEndpoint + '/request?{"accountInitiator": "' + accountId + '", "state": "8c35dc706cccbba6"}', function(data){
        $.each(data, function(index, value){
            storage.addOutgoingRequest(value);
        });
    });
    
};

storage.getIncomingPayments = function () {
    $.getJSON(deploydEndpoint + '/payment?accountReciever=' + accountId, function(data){
        $.each(data, function(index, value){
            storage.addIncomingPayment(value);
        });
    });
};

storage.getOutgoingPayments = function () {
    $.getJSON(deploydEndpoint + '/payment?accountInititator=' + accountId, function(data){
        $.each(data, function(index, value){
            storage.addOutgoingPayment(value);
        });
    });
};

storage.addIncomingRequest = function(value){
    console.log("S1. Adding request: " + value);
    if (storage.contains(storage.incomingRequests, value.id)){
        console.log("Storage:addRequest - Cannot insert, not unique element");
    }
    else {
        storage.incomingRequests.push({
            accountInitiator: value.accountInitiator,
            accountReciever: value.accountReciever,
            amount: value.amount,
            id: value.id,
            initiator: value.initiator,
            state: value.state,
            date: value.submitDate,
            message: value.message,
        });
        storage.saveTransaction();
    }
};

storage.addOutgoingRequest = function(value){
    console.log("S1. Adding request: " + value);
    if (storage.contains(storage.outgoingRequests, value.id)){
        console.log("Storage:addRequest - Cannot insert, not unique element");
    }
    else {
        storage.outgoingRequests.push({
            accountInitiator: value.accountInitiator,
            accountReciever: value.accountReciever,
            amount: value.amount,
            id: value.id,
            reciever: value.reciever,
            state: value.state,
            date: value.submitDate,
            message: value.message
        });
        storage.saveTransaction();
    }
};

// CODE DUPLICITY!!
storage.addOutgoingPayment = function(value){
  console.log("S2. Adding payment: " + value);
    if (storage.contains(storage.outgoingPayments, value.id)){
        console.log("Storage:addPayment - Cannot insert, not unique element");
    }
    else {
        storage.outgoingPayments.push({
            accountInitiator: value.accountInitiator,
            accountReciever: value.accountReciever,
            amount: value.amount,
            id: value.id,
            reciever: value.reciever,
            state: value.state,
            date: value.submitDate,
            message: value.message
        });
        storage.saveTransaction();
    }
};

storage.addIncomingPayment = function(value){
  console.log("S2. Adding payment: " + value);
    if (storage.contains(storage.incomingPayments, value.id)){
        console.log("Storage:addPayment - Cannot insert, not unique element");
    }
    else {
        storage.incomingPayments.push({
            accountInitiator: value.accountInitiator,
            accountReciever: value.accountReciever,
            amount: value.amount,
            id: value.id,
            reciever: value.reciever,
            state: value.state,
            date: value.submitDate,
            message: value.message
        });
        storage.saveTransaction();
    }
};

storage.contains = function(collection, id){
    console.log("S3. Contains" + collection);
    id.trim();
    var flag = false;
    console.log("Searching for id:"+id + ", length "+ id.length + "typeof " + typeof id);
    $.each(collection, function(index){
        console.log(collection[index]);
        console.log("current id: "+ collection[index].id + ", length: " + collection[index].id.length);
        if (id===collection[index].id.trim()){
          console.log("contain duplicity");
          flag = true;
          return true;
        }
    });
    console.log("Without duplicity");
    return flag;
};
storage.saveTransaction = function(){
    //TODO: Handle persisting datas in device memory
    //localStorage.setItem('billMe', JSON.stringify(this.transactions));
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

systemVariables.clearOut = function () {
  systemVariables.newTransaction = {};    
};
