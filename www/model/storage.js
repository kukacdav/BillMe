

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
        navigationController.replacePageWith('main-multi-page-template');
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
        storage.newTransaction.message = "";
    else
        storage.newTransaction.message = message;
    storage.buildTransactionReciever();
    storage.submitTransaction();
};

storage.buildTransactionReciever = function(){
    console.log(storage.contactList[storage.newTransaction.contactIndex]);
    storage.newTransaction.reciever = storage.contactList[storage.newTransaction.contactIndex].id;
    storage.newTransaction.recieverDetail.fullName = storage.contactList[storage.newTransaction.contactIndex].fullName;
    storage.newTransaction.recieverDetail.phone = storage.contactList[storage.newTransaction.contactIndex].contact.phone;
    storage.newTransaction.recieverDetail.email = storage.contactList[storage.newTransaction.contactIndex].contact.email;
    storage.newTransaction.recieverDetail.facebook = storage.contactList[storage.newTransaction.contactIndex].contact.facebook;    
};

// Method for sending new transaction to backend server
storage.submitTransaction = function(){
    var storageInitialized;
    if (storage.newTransaction.transactionType === "payment")
        storageInitialized = $.when(communicationController.persistTransaction("payment"));
    else if (storage.newTransaction.transactionType === "request")
        storageInitialized = $.when(communicationController.persistTransaction("request"));
    storageInitialized.done(function(data)
    {
        callback = function(){navigationController.switchPage('view/html/success-submit-page.html');};
        storage.updateUserData(callback);
    });
};

//Method for retrieving fresh data from backend server
storage.updateUserData = function(callback){
    console.log("Updating user data");
    var storageInitialized = $.when(communicationController.getUserData(storage.uid));
    storageInitialized.done(function(userData)
    {
        storage.storeUserData(userData);
        callback();
    });
};

//Method for wipping out data about previous request
storage.clearOutSystemVariables = function () {
    console.log("Clearing out system data");
    console.log(storage.newTransaction);
  storage.newTransaction.recieverData = {};
  storage.newTransaction.amount = "";
  storage.newTransaction.message = "";
  storage.newTransaction.reciever = "";
};

// Method when creating new transaction
storage.createNewTransaction = function(type) {
    storage.newTransaction.transactionType = type;
    navigationController.switchPage('view/html/contact-list-page.html');
};

//Method for storing index of seleceted contact 
storage.transactionContactSelected = function(index) {
    storage.newTransaction.contactIndex = index;
    navigationController.switchPage('view/html/set-amount-page.html');  
};
  
//Method for showing detail of transaction
storage.showTransactionDetail = function(id, elementIndex) {
        systemVariables.transactionType = id;
        systemVariables.elementIndex = elementIndex;    
        navigationController.switchPage('view/html/transaction-detail-page.html');
};

// Method for rejecting incoming request
storage.rejectSelectedRequest = function() {
    dataSource = storage.userData.incomingRequests[systemVariables.elementIndex];
    newState = "rejected";
    var storageInitialized = $.when(communicationController.changeRequestState(dataSource, newState));
    storageInitialized.done(function(data) {
        callback = function(){navigationController.resetToMainPage();};
        storage.updateUserData(callback);
    });
};



// Method for canceling outgoing request
storage.cancelSelectedRequest = function() {
    newState = "canceled";
    dataSource = storage.userData.outgoingRequests[systemVariables.elementIndex];
    var storageInitialized = $.when(communicationController.changeRequestState(dataSource, newState));
    storageInitialized.done(function(data) {
        callback = function(){navigationController.resetToMainPage();};
        storage.updateUserData(callback);
    });
};

//Method for accepting request
storage.acceptSelectedRequest = function() {
    dataSource = storage.userData.incomingRequests[systemVariables.elementIndex];
    this.buildRespondPayment(dataSource);
    var storageInitialized = $.when(communicationController.persistTransaction("payment"));
    storageInitialized.done(function(data) {
        var requestUpdated = $.when(communicationController.completeRequest(storage.userData.incomingRequests[systemVariables.elementIndex].id, data.id));
        requestUpdated.done(function(data) {
        callback = function(){navigationController.resetToMainPage();};
        storage.updateUserData(callback);
        });
    });
};

storage.buildRespondPayment = function(dataSource) {
    console.log("*** " + dataSource.id);
    storage.newTransaction.reciever = dataSource.initiator;
    console.log(dataSource);
    storage.newTransaction.recieverDetail = dataSource.initiatorDetail;
    storage.newTransaction.recieverDetail.email = dataSource.initiatorDetail.email;
    storage.newTransaction.recieverDetail.facebook = dataSource.initiatorDetail.facebook;
    storage.newTransaction.recieverDetail.fullName = dataSource.initiatorDetail.fullName;
    storage.newTransaction.amount = dataSource.amount;
    storage.newTransaction.message = document.querySelector('#response-message-input').value;
};



/* NOT REFACTORED*/

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


