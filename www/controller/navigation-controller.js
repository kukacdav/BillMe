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
        console.log(document.querySelector('#transaction-list'));
        // FOR DEBUGGING PURPOUSE
        page.querySelector('#create-request-button').onclick = function(){systemVariables.transactionType="request";switchPage('view/html/contact-list-page.html');};
        page.querySelector('#create-payment-button').onclick = function(){systemVariables.transactionType="payment";switchPage('view/html/contact-list-page.html');};
        //page.querySelector('#request-toolbar-button').onclick = function(){systemVariables.transactionType="request";switchPage('view/html/contact-list-page.html');};
        page.querySelector('#payment-button').addEventListener('click', showPayments);
        page.querySelector('#request-button').addEventListener('click', showRequests);
        page.querySelector('#user-detail-button').onclick = function(){switchPage('view/html/user-detail-page.html');};
        showPayments();
    }
    else if (page.id === 'contact-list-page')
    {
        console.log("N2. Initializing contact-list-page ");
        showContactList();
        $(".contact-list-detail").on("click", showContactListDetail);
        //page.querySelector('#define-transaction-button').onclick = function(){switchPage('view/html/define-transaction-page.html');};
  
    }
    else if (page.id === 'success-submit-page')
    {
        console.log("N3. Initializing submit-success-page ");
        flag = 1;
        page.querySelector('#transaction-success-button').onclick = function(){document.querySelector('#pageNavigator').resetToPage('view/html/main-page.html')};
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
});


successfullTransaction = function () {
    switchPage('view/html/success-submit-page.html');
};

showTransactionDetail = function() {
    storage.transaction.name = $(this.querySelector('.transaction-party')).text();
    storage.transaction.amount = $(this.querySelector('.transaction-amount')).text();
    storage.transaction.state = $(this.querySelector('.transaction-state')).text();
    switchPage('view/html/transaction-detail-page.html');
};

switchPage = function(target) {
    document.querySelector('.pageNavigator').pushPage(target);
};

showContactListDetail = function() {
    systemVariables.newTransactionItem = $(this.querySelector('.contact-index')).text();
    switchPage('view/html/define-transaction-page.html');
};