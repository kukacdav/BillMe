// Transaction-controller
// author: David Kukacka

// Transaction controller handle all logic asosiated with trasnactions - requests and payments





function acceptSelectedRequest(newState) {
    dataSource = storage.incomingRequests[systemVariables.elementIndex];
    buildRespondPayment(dataSource);
    changeAccountBalance(dataSource.accountInitiator, dataSource.amount);
    changeAccountBalance(storage.account.accountId, (-1)*(dataSource.amount));
    createLinkedPayment(dataSource, newState);    
}


function cancelSelectedRequest(newState) {
    if (systemVariables.transactionType === "filter-outgoing-requests")
        dataSource = storage.outgoingRequests[systemVariables.elementIndex];
    else if (systemVariables.transactionType === "filter-incoming-requests")
        dataSource = storage.incomingRequests[systemVariables.elementIndex];
    alterRequestInPersistence(dataSource, newState);
}



paymentToRequestSuccessfull = function() {
    storage.incomingRequests.splice(0,storage.incomingRequests.length);
    storage.getIncomingRequests();
    storage.incomingPayments.splice(0,storage.incomingPayments.length);
    storage.getIncomingPayments();
    storage.getAccountDetail();
    switchPage('view/html/success-submit-page.html');

};

