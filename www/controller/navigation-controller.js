// Navigation controller
// author: David Kukacka

// Navigation controller handles all logic asocieted with navigation through multiple pages, adding eventListeners and such events




document.addEventListener('init', function(event)
{
    console.log("Navigation handler..");
    var page = event.target;

    if (page.id === 'main-page')
    {    
        console.log("N1. Initializing Main Page ");
        composeMainPage(page);
    }
    else if (page.id === 'contact-list-page')
    {
        composeContactListPage(page);
    }
    else if (page.id === 'phone-contacts-page')
    {
        composePhoneContactsPage(page);
    }
    else if (page.id === 'success-submit-page')
    {
        console.log("N3. Initializing submit-success-page ");
        composeSuccessSubmitPage();
        //page.querySelector('#transaction-success-button').onclick = function(){switchPage('view/html/main-page.html');};
    }
    else if (page.id === 'define-transaction-page')
    {
        console.log("N4. Initializing define-transaction-page ");
        //page.querySelector('#submit-transaction-button').onclick = function(){switchPage('view/html/success-submit-page.html');};
        composeDefineTransactionPage();
    }
    else if (page.id === 'user-detail-page') {
        console.log("N5. Initializing user-detail-page");
        showUserData();

    }
    else if (page.id === 'transaction-detail-page')
    {
        console.log("N6 - Showing transactionDetail");
        composeTransactionDetailPage();
    }
    else if (page.id === 'reuqest-detail-page')
    {
        console.log("N6 - Showing transactionDetail");
        composeRequestDetailPage();
    }
    else if (page.id === 'more-options-page')
    {
    }
    else if (page.id === 'invite-friend-page')
    {
    }
    else if (page.id === 'set-amount-page')
    {
        composeSetAmountPage();
    }
    else if (page.id === 'confirm-transaction-page')
    {
        composeConfirmTransactionPage();
    }
    
});


// THIS SHOULD NOT BE IN CONTROLLER
successfullPayment = function () {
    storage.getOutgoingPayments();
    systemVariables.clearOut();
    switchPage('view/html/success-submit-page.html');

};
successfullRequest = function () {
    storage.getOutgoingRequests();
    storage.getIncomingRequests();
    systemVariables.clearOut();
    switchPage('view/html/success-submit-page.html');
};
    
showTransactionDetail = function() {
        systemVariables.transactionType = $(this).attr('id');
        systemVariables.elementIndex = $(this.querySelector('#transaction-index')).text();    
        switchPage('view/html/transaction-detail-page.html');
    };
    

    
    switchPage = function(target) {
        console.log("pushing page: " + target);
        document.querySelector('#pageNavigator').pushPage(target);
};

showContactListDetail = function() {
    systemVariables.newTransactionItem = $(this.querySelector('.contact-index')).text();
    getContraAccount();
    switchPage('view/html/set-amount-page.html');
};
