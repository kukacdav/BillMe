

storage.init = function(data){
    console.log("S0. Initializing storage");
    //UNCOMMENT FOR STORING DATA
    //storage.loadStoredData();
    storage.storeSessionData(data);
    var storageInitialized = $.when(communicationController.getUserData(storage.uid), communicationController.loadContactList());
    storageInitialized.done(function(userData, contactList)
    {
        storage.storeUserData(userData);
        storage.storeContactList(contactList);
        navigationController.switchToMainPage();
    });
    
};

// Method for storing user data querried from server
storage.storeUserData = function(data){
    storage.userData = data;
};
// Method for storing contact list querried from server
storage.storeContactList = function(data){
    storage.contactList = data;
};
//Method for storing sessionData gotten when authenticating
storage.storeSessionData = function(data){
    storage.id = data.id;
    storage.uid = data.uid;
};

//Method for storing submited message
storage.storeNewTransactionMessage= function(message){
    if (message == null)
        systemVariables.newTransaction.message = "";
    else
        systemVariables.newTransaction.message = message;
    storage.submitTransaction();
};

// Method for sending new transaction to backend server
storage.submitTransaction = function(){
    var storageInitialized;
    if (systemVariables.newTransaction.transactionType === "payment")
        storageInitialized = $.when(communicationController.persistTransaction("payment"));
    else if (systemVariables.newTransaction.transactionType === "request")
        storageInitialized = $.when(communicationController.persistTransaction("request"));
    storageInitialized.done(function(data)
    {
        storage.updateUserData();
    });
};

//Method for retrieving fresh data from backend server
storage.updateUserData = function(){
    console.log("Updating user data");
    var storageInitialized = $.when(communicationController.getUserData(storage.uid));
    storageInitialized.done(function(userData)
    {
        storage.storeUserData(userData);
        navigationController.switchPage('view/html/success-submit-page.html');
    });
};

//Method for wipping out data about previous request
storage.clearOutSystemVariables = function () {
    console.log("Clearing out system data");
  systemVariables.newTransaction = {};    
};

    


storage.loadStoredData = function() {
    storage.incomingRequests = JSON.parse(localStorage.getItem('incomingRequests') || '[]' );  
    storage.outgoingRequests = JSON.parse(localStorage.getItem('outgoingRequests') || '[]' );
    storage.outgoingRequests = JSON.parse(localStorage.getItem('incomingPayments') || '[]' );  
    storage.outgoingRequests = JSON.parse(localStorage.getItem('outgoingPayments') || '[]' );  
    storage.account = JSON.parse(localStorage.getItem('account') || '{}' );
    storage.account = JSON.parse(localStorage.getItem('userContact') || '{}' );  
};



storage.getAccountDetail = function() {
    console.log("S10. Getting account detail from deployd.");
    $.getJSON(deploydEndpoint + '/account?id=' + accountId, function(data){
        console.log("Successfully getting accountDetail ");
        storage.account.accountNumber = data.accountNumber;
        storage.account.balance = data.balance;
        storage.account.accountName = data.accountName;
    });
    storage.account.accountId = accountId;
    //UNCOMMENT FOR STORING DATA FUNCTION
    //localStorage.setItem('account', JSON.stringify(this.storage.account));

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


