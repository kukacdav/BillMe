// Script.js
// This file contains methods of class Storage, representation of Model. 
// Methods handles data of application
// Created by: David Kukacka

// Method for initializing storage
storage.init = function(data){
    console.log("Storage: Initializing storage");
    storage.storeSessionData(data);
};

// Method for storing user data querried from server
// second party of each transacion is translated according to name stored in device
storage.storeUserData = function(data){
    console.log("Storage: Storing user data " + data.fullName);
    for (var i = 0; i < data.incomingPayments.length; i++) {
        var fullName = this.translateName(data.incomingPayments[i].initiatorDetail.phone, data.incomingPayments[i].initiatorDetail.fullName);
        data.incomingPayments[i].initiatorDetail.fullName = fullName;
    }
    for (var i = 0; i < data.outgoingPayments.length; i++) {
        var fullName = this.translateName(data.outgoingPayments[i].initiatorDetail.phone, data.outgoingPayments[i].initiatorDetail.fullName);
        data.outgoingPayments[i].initiatorDetail.fullName = fullName;
    }
    for (var i = 0; i < data.incomingRequests.length; i++) {
        var fullName = this.translateName(data.incomingRequests[i].initiatorDetail.phone, data.incomingRequests[i].initiatorDetail.fullName);
        data.incomingRequests[i].initiatorDetail.fullName = fullName;
    }
    for (var i = 0; i < data.outgoingRequests.length; i++) {
        var fullName = this.translateName(data.outgoingRequests[i].initiatorDetail.phone, data.outgoingRequests[i].initiatorDetail.fullName);
        data.outgoingRequests[i].initiatorDetail.fullName = fullName;
    }
    console.log("Storage: User data stored ");
    storage.userData = data;
};


// Method for storing contact list querried from server
storage.storeContactList = function(data){
    console.log("Storage: Storing contact list: ");
    var array = [];
    for (var i = 0; i<data.validPhones.length; i++){
        data.validPhones[i].id = i;
        array.push(data.validPhones[i]);
    }
    storage.cordovaContacts = array;
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
    console.log("Building transaction reciever");
    console.log(storage.cordovaContacts[storage.newTransaction.contactIndex] );
    storage.newTransaction.reciever = storage.cordovaContacts[storage.newTransaction.contactIndex].reciever;
    storage.newTransaction.recieverDetail.fullName = storage.cordovaContacts[storage.newTransaction.contactIndex].name;
    storage.newTransaction.recieverDetail.phone = storage.cordovaContacts[storage.newTransaction.contactIndex].phoneNumber;
};

// Method for sending new transaction to backend server
storage.submitTransaction = function(){
    console.log("Submitting transaction: " + storage.newTransaction.transactionType);
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
        hideModal();
        callback();
    });
};

// Method for updating user data on server
storage.changeUserData = function(newName, newAccountName){
    console.log("Storage: Changing user data");
    alert(newName);
    alert(newAccountName);
    communicationController.changeUserDetail(newName, newAccountName);
};

// Method for user data update
storage.updateUserDetail = function(newName, newAccountName){
    console.log("Updating user detail");
    this.userData.fullName = newName;
    this.bankAccount.accountName = newAccountName;
    pageController.composeUserDetailPage(document);
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

//Method for storing index of seleceted contact 
storage.transactionContactSelected = function(index) {
    storage.newTransaction.contactIndex = index;
    navigationController.pushPage('pageNavigator', 'view/html/set-amount-page.html');
};
  
//Method for showing detail of transaction
storage.showTransactionDetail = function(id, elementIndex) {
        systemVariables.transactionType = id;
        systemVariables.elementIndex = elementIndex;
        document.getElementById('tabbar').setTabbarVisibility(false);
        navigationController.pushPage('pageNavigator', 'view/html/transaction-detail-page.html');
};

// Method for rejecting incoming request
storage.rejectSelectedRequest = function() {
    showModal();
    dataSource = storage.userData.incomingRequests[systemVariables.elementIndex];
    newState = "rejected";
    var storageInitialized = $.when(communicationController.changeRequestState(dataSource, newState));
    storageInitialized.done(function(data) {
        callback = function(){hideModal();document.getElementById('tabbar').setTabbarVisibility(true);navigationController.resetToPage('pageNavigator', 'main-page-template');};
        storage.updateUserData(callback);
    });
};



// Method for canceling outgoing request
storage.cancelSelectedRequest = function() {
    showModal();
    newState = "canceled";
    dataSource = storage.userData.outgoingRequests[systemVariables.elementIndex];
    var storageInitialized = $.when(communicationController.changeRequestState(dataSource, newState));
    storageInitialized.done(function(data) {
        callback = function(){hideModal(); document.getElementById('tabbar').setTabbarVisibility(true);navigationController.resetToPage('pageNavigator', 'main-page-template');};
        storage.updateUserData(callback);
    });
};

//Method for accepting request
storage.acceptSelectedRequest = function() {
    
    var pin = document.querySelector('#pin-input').value;
    if (pin !== this.userData.pin){
        console.log("inncorrect pin!!!");
        $('#pin-input').addClass("incorrect-pin");  
        document.querySelector('#pin-input').value = "";
        return;
    }
    else{
    
    if (this.controlInputAmount(storage.userData.incomingRequests[systemVariables.elementIndex].amount)){
        showModal();
    dataSource = storage.userData.incomingRequests[systemVariables.elementIndex];
    this.buildRespondPayment(dataSource);
    var storageInitialized = $.when(communicationController.persistTransaction("payment"));
    storageInitialized.done(function(data) {
        var requestUpdated = $.when(communicationController.completeRequest(storage.userData.incomingRequests[systemVariables.elementIndex].id, data.id));
        requestUpdated.done(function(data) {
        callback = function(){hideModal(); document.getElementById('tabbar').setTabbarVisibility(true);navigationController.resetToPage('pageNavigator', 'main-page-template'); };
        storage.updateUserData(callback);
        });
    });}
    }
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
    var fullName = this.translateName(data.initiatorDetail.phone, data.initiatorDetail.fullName);
    data.initiatorDetail.fullName = fullName;
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
    var fullName = this.translateName(data.initiatorDetail.phone, data.initiatorDetail.fullName);
    data.initiatorDetail.fullName = fullName;
    this.userData.incomingRequests.unshift(data);
    if (currentFilter === 'unresolvedTransactions'){
        pageController.showIncomingRequests(this.userData.incomingRequests);
        $(".transaction-item-detail").on("click", function(){
        id = $(this).attr('id');
        elementIndex = $(this.querySelector('#transaction-index')).text();
        storage.showTransactionDetail(id, elementIndex);
        });
    }
};

//Method for translating name of second party
storage.translateName = function(phone, fullName){
    for (var z = 0; z < storage.cordovaContacts.length; z++) {
        if (storage.cordovaContacts[z].phoneNumber === phone){
            return storage.cordovaContacts[z].name;
        }
    }
    console.log("Storage, transalate: NameUnknown number..");
    return fullName;
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

// MEthod for reloading list of outgoing requests in event of their change
storage.requestStateChanged = function(data){
    console.log("Reuqest changed, length : " + storage.userData.outgoingRequests.length);
    for (var i=0; i < storage.userData.outgoingRequests.length; i++){
        console.log("comparing: " + data.id + " " + storage.userData.outgoingRequests[i].id);
        if (data.id === storage.userData.outgoingRequests[i].id){
            console.log("Storage: Request state changed!!");
            storage.userData.outgoingRequests.splice(i, 1); 
            break;
        }
        
    }
    if (currentFilter === 'unresolvedTransactions')
        pageController.showRequests();
};


// Method for loading data stored in device memory
storage.loadStoredData = function() {
    storage.incomingRequests = JSON.parse(localStorage.getItem('incomingRequests') || '[]' );  
    storage.outgoingRequests = JSON.parse(localStorage.getItem('outgoingRequests') || '[]' );
    storage.outgoingRequests = JSON.parse(localStorage.getItem('incomingPayments') || '[]' );  
    storage.outgoingRequests = JSON.parse(localStorage.getItem('outgoingPayments') || '[]' );  
    storage.account = JSON.parse(localStorage.getItem('account') || '{}' );
    storage.account = JSON.parse(localStorage.getItem('userContact') || '{}' );  
};

storage.updateData = function (userData){
    storage.userData.fullName = userData.fullName;
    storage.userData.bankAccount.accountName = userData.bankAccount.accountName;
};