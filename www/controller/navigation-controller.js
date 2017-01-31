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
        attachTabbarListeners();
        showPayments();
    }
    else if (page.id === 'contact-list-page')
    {
        console.log("N2. Initializing contact-list-page ");
        showContactList();
        $(".contact-list-detail").on("click", showContactListDetail);
        attachTabbarListeners();
        //page.querySelector('#define-transaction-button').onclick = function(){switchPage('view/html/define-transaction-page.html');};
  
    }
    else if (page.id === 'success-submit-page')
    {
        console.log("N3. Initializing submit-success-page ");
        flag = 1;
        page.querySelector('#transaction-success-button').onclick = function(){document.querySelector('#pageNavigator').resetToPage('view/html/main-page.html')};
        page.querySelector('#transaction-success-button').onclick = function(){switchPage('view/html/main-page.html');};
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
        attachTabbarListeners();

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
        attachTabbarListeners();
    }
    else if (page.id === 'invite-friend-page')
    {
        attachTabbarListeners();
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

showNewPage = function(target){
    document.querySelector('#pageNavigator').resetToPage(target);
};

switchPage = function(target) {
    
    console.log("pushing page: " + target);
    document.querySelector('#pageNavigator').pushPage(target);
    //document.querySelector('#tabbar').loadPage(target);
};

showContactListDetail = function() {
    systemVariables.newTransactionItem = $(this.querySelector('.contact-index')).text();
    switchPage('view/html/define-transaction-page.html');
};

attachTabbarListeners = function() {
    console.log("Adding tabbar listeners");
    document.querySelector('#tabbar-main-page').onclick = function(){showNewPage('view/html/main-page.html')};
    document.querySelector('#tabbar-profile-page').onclick = function(){showNewPage('view/html/user-detail-page.html')};
    document.querySelector('#tabbar-contact-list-page').onclick = function(){showNewPage('view/html/contact-list-page.html')};
    document.querySelector('#tabbar-invite-page').onclick = function(){showNewPage('view/html/invite-friend-page.html')};
    document.querySelector('#tabbar-more-options').onclick = function(){showNewPage('view/html/more-options-page.html')};
    
};