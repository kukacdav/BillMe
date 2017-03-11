

storage.init = function(data){
    console.log("S0. Initializing storage");
    //UNCOMMENT FOR STORING DATA
    //storage.loadStoredData();
    storage.storeSessionData(data);
    var storageInitialized = $.when(communicationController.getUserData(storage.uid), communicationController.loadContactList(),communicationController.initializeApplicationListeners());
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
    if (this.controlInputAmount(storage.userData.incomingRequests[systemVariables.elementIndex].amount)){
    dataSource = storage.userData.incomingRequests[systemVariables.elementIndex];
    this.buildRespondPayment(dataSource);
    var storageInitialized = $.when(communicationController.persistTransaction("payment"));
    storageInitialized.done(function(data) {
        var requestUpdated = $.when(communicationController.completeRequest(storage.userData.incomingRequests[systemVariables.elementIndex].id, data.id));
        requestUpdated.done(function(data) {
        callback = function(){navigationController.resetToMainPage();};
        storage.updateUserData(callback);
        });
    });}
};

storage.controlInputAmount = function(amount){
  if (amount <= this.userData.accountBalance){
    console.log("Sufficient balance to pay for request");
    document.querySelector('#insufficientBalanceNote').innerHTML = "";
    return true;
  }
  document.querySelector('#insufficientBalanceNote').innerHTML = "Nemáte na účtě dostatečný zůstatek.";
  return false;
};

//Method for building data payload of data to be sent
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



// Method for showing newly arriven payment
storage.newIncomingPayment = function(data){
    if (this.contains(this.userData.incomingPayments, data)){
        console.log("Item not unique");
        return;
    }
    console.log("Unique item");
    this.userData.incomingPayments.unshift(data);
    if (currentFilter === 'incomingPayments')
        pageController.showIncomingPayments();
};

// Method for showing newly arriven request
storage.newIncomingRequest = function(data){
        if (this.contains(this.userData.incomingRequests, data)){
        console.log("Item not unique");
        return;
    }
    console.log("Unique item");
    this.userData.incomingRequests.unshift(data);
    if (currentFilter === 'unresolvedTransactions')
        pageController.showIncomingRequests(this.userData.incomingRequests);
};



//Method for establishing, whether datasource contains item
// Returns true, if  data id is contained in dataSource 
storage.contains = function(dataSource, data){
  console.log(data);
  for (var i=0; i < dataSource.length; i++){
      if (dataSource[i].id === data.id){
          console.log("Found match: " + dataSource[i].id + " " + data.id );
          return true;
      }
  }
  console.log("No match found");
  return false;
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
