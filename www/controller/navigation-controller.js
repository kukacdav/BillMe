// Navigation controller
// author: David Kukacka
// Navigation controller handles all logic asocieted with navigation through multiple pages. 
// Navigation controller listens for page initalization and calls pageController to handle content loading

navigationController.switchToMainPage = function() {
    console.log("Switching to main page");
    document.querySelector('#main-navigator').replacePage('main-multi-page-template');
    //pageController.composeMainPage();
};


document.addEventListener('init', function(event)
{
    var page = event.target;
    console.log("Navigation controler: " + page.id);

    if (page.id === 'main-page')
            pageController.composeMainPage(page);
    else if (page.id === 'user-detail-page')
        pageController.composeUserDetailPage(page);
    else if (page.id === 'phone-contacts-page')
        pageController.composePhoneContactsPage(page);
    else if (page.id === 'more-options-page')
        pageController.composeMoreOptionsPage(page);
    else if (page.id === 'invite-friend-page')
        pageController.composeInviteFriendPage(page);
    else if (page.id === 'contact-list-page')
        pageController.composeContactListPage(page);
    else if (page.id === 'set-amount-page')
        pageController.composeSetAmountPage(page);
    else if (page.id === 'define-transaction-page')
        pageController.composeDefineTransactionPage(page);
    else if (page.id === 'confirm-transaction-page')
        pageController.composeConfirmTransactionPage(page);
            else if (page.id === 'success-submit-page')
        pageController.composeSuccessSubmitPage(page);
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

navigationController.switchPage = function(target) {
        console.log("pushing page: " + target);
        document.querySelector('#pageNavigator').pushPage(target);
};

    
showTransactionDetail = function() {
        systemVariables.transactionType = $(this).attr('id');
        systemVariables.elementIndex = $(this.querySelector('#transaction-index')).text();    
        switchPage('view/html/transaction-detail-page.html');
    };
    

    

moreOptionsSwitchPage= function(target) {
        console.log("More options navigator, pushing page: " + target);
        document.querySelector('#moreOptionsNavigator').pushPage(target);
};


navigationController.showContactListDetail = function() {
    systemVariables.newTransactionItem = $(this.querySelector('.contact-index')).text(); // THIS SHOULD HANDLE MODEL
    navigationController.switchPage('view/html/set-amount-page.html');
};

setToMainPage = function() {
    document.querySelector('#main-navigator').pushPage('view/html/main-page.html');
    composeMainPage();
}