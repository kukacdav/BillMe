// Navigation controller
// author: David Kukacka
// Navigation controller handles all logic asocieted with navigation through multiple pages. 
// Navigation controller listens for page initalization and calls pageController to handle content loading

/*
navigationController.replacePageWith = function(target) {
    console.log("Switching to main page");
    document.querySelector('#main-navigator').replacePage(target);
};
*/

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
    else if (page.id === 'confirm-transaction-page')
        pageController.composeConfirmTransactionPage(page);
    else if (page.id === 'success-submit-page')
        pageController.composeSuccessSubmitPage(page);
    else if (page.id === 'transaction-detail-page')
        pageController.composeTransactionDetailPage();
    else if (page.id === 'reuqest-detail-page')
        pageController.composeRequestDetailPage();
    else if (page.id === 'register-outcome-page')
        pageController.composeRegisterOutcomePage(page);
    else if (page.id === 'new-contact-page')
        pageController.composeNewContactPage(page);
    else if (page.id === 'success-action-page')
        pageController.composeSuccessActionPage(page);
    else if (page.id === 'change-userdata-page')
        pageController.composeChangeUserDataPage(page);
    else if (page.id === 'financial-overview-page')
        pageController.composeFinancialOverviewPage(page);
    else if (page.id === 'security-crossroad-page')
        pageController.composeSecurityCrossroadPage(page);
    else if (page.id === 'change-password-page')
        pageController.composeChangePasswordPage(page);
    else if (page.id === 'change-pin-page')
        pageController.composeChangePINPage(page);
        
    
});


navigationController.switchPage = function(target) {
        console.log("pushing page: " + target);
        document.querySelector('#pageNavigator').pushPage(target);
};



navigationController.resetToMainPage = function(){
    document.querySelector('#pageNavigator').resetToPage('main-page-template'); 
};
/*
moreOptionsSwitchPage= function(target) {
        console.log("More options navigator, pushing page: " + target);
        document.querySelector('#moreOptionsNavigator').pushPage(target);
};

setToMainPage = function() {
    document.querySelector('#main-navigator').pushPage('view/html/main-page.html');
    composeMainPage();
};
*/
// General navigator methods

navigationController.pushPage = function(navigator, target){
    console.log("Navigator controller: " + navigator);
    console.log("pushing: " + target );
    var selectedNavigator = document.getElementById(navigator); 
    selectedNavigator.pushPage(target);
};

navigationController.popPage = function(navigator){
    var selectedNavigator = document.getElementById(navigator); 
    selectedNavigator.popPage();
};

navigationController.resetToPage = function(navigator, target){
    //console.log("Navigator controller: " + navigator + " reseting to " + target );
    var selectedNavigator = document.getElementById(navigator); 
    selectedNavigator.resetToPage(target, {animation: "slide"});
};

navigationController.replacePage = function(navigator, target){
    var selectedNavigator = document.getElementById(navigator); 
    selectedNavigator.replacePage(target);
};
