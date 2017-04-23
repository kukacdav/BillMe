// Transaction controller
// This class has responsibility for handeling transaction related logic
// Created by: David Kukacka

var transactionController = {};

// Method when creating new transaction
// as input method recieves type of transaction: request / payment
transactionController.createNewTransaction = function(type) {
    storage.newTransaction.transactionType = type;
    navigationController.pushPage('pageNavigator','view/html/contact-list-page.html');
};


// Method for calculating sum of income over period of last month
// Method goes through all incoming payments and returns total sum
transactionController.countSumOfIncomingPayments = function(){
    console.log("TransactionController: incomingP.");
    var collection = storage.userData.incomingPayments;
    var sum = 0;
    for(var i=0; i<collection.length; i++){
        if (transactionController.validateDate(collection[i].submitDate))
            sum += collection[i].amount;
    }
    return sum;
};

// Method for calculating sum of outcome over period of last month
// Method goes through all outgoing payments and returns total sum
transactionController.countSumOfOutgoingPayments = function(){
    var collection = storage.userData.outgoingPayments;
    var sum = 0;
    for(var i=0; i<collection.length; i++){
        if (transactionController.validateDate(collection[i].submitDate))
            sum += collection[i].amount;
    }
    return sum;
};
 
// Method for validating, whether date is older then month
transactionController.validateDate = function(checkpoint){
    var d = new Date();
    var n = d.getTime();
	if ( checkpoint < (n - 2629746000) )
		return false;
	else
		return true;
};
 
 
transactionController.countIncomingRequest = function(){
    var sum = storage.userData.incomingRequests.length;
    return sum;
};

transactionController.countOutgoingRequests = function(){
    return storage.userData.outgoingRequests.length;
};

