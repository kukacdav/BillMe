// Page controller
// This class has responsibility for composing all content of pages
// Created by: David Kukacka

// Method for composing register outcome page
pageController.composeRegisterOutcomePage = function(page) {
    if (storage.registrationOutcome === 'success'){
        buildSuccesfullRegistrationOutcomePage(page);
        page.querySelector('#register-continue-button').onclick = function(){
            loginController.login(storage.username, storage.password);
        };
    }
    else{
        buildUnsuccesfullRegistrationOutcomePage(page);
        page.querySelector('#register-continue-button').onclick = function(){
            loginController.backToLogin();
        };
    }
};


//Method for composing main page
pageController.composeMainPage = function (page) {
        
        var accountNumber = storage.userData.bankAccount.accountPrefix + "-" + storage.userData.bankAccount.accountNumber + "/" + storage.userData.bankAccount.bankCode;
        var balance = storage.userData.accountBalance;
        buildMainPage(page, storage.userData.bankAccount.accountName, accountNumber, balance );        
        page.querySelector('#create-payment-button').onclick = function(){transactionController.createNewTransaction("payment");};
        page.querySelector('#create-request-button').onclick = function(){transactionController.createNewTransaction("request");};
        page.querySelector('#incoming-payments-filter').onclick = function(){activateIncomingPayments();pageController.showIncomingPayments(page);};
        page.querySelector('#outgoing-payments-filter').onclick = function(){activateOutgoingPayments();pageController.showOutgoingPayments();};
        page.querySelector('#unresolved-transactions-filter').onclick = function(){activateUnresolvedTransactions(); pageController.showRequests();};
        pageController.showIncomingPayments(page);
        document.querySelector('#main-navigator').addEventListener('prepop', function(event) {
        if(event.currentPage.id === "contact-list-page" || event.currentPage.id === "transaction-detail-page") {
            document.getElementById('tabbar').setTabbarVisibility(true);
            pageController.lightDown();
            }        
        });  
        document.querySelector('#tabbar').addEventListener('prechange', function(event) {
            pageController.lightDown();
        });  
};


//Method for composing page with user detail
pageController.composeUserDetailPage = function(page) {
    var accountNumber = storage.userData.bankAccount.accountPrefix + "-" + storage.userData.bankAccount.accountNumber;
    buildUserDeatilPage(page, storage.userData.fullName, storage.userData.phoneNumber, storage.userData.bankAccount.accountName, accountNumber, storage.userData.bankAccount.bankCode);
    page.querySelector('#change-user-data').onclick = function(){
        document.getElementById('tabbar').setTabbarVisibility(false);
        navigationController.pushPage('userDetailNavigator', 'change-userdata-template');
    };
    document.querySelector('#userDetailNavigator').addEventListener('prepop', function(event) {
        if(event.currentPage.id === "change-userdata-page") {
            document.getElementById('tabbar').setTabbarVisibility(true);
        }
    });  
};

// Method for composing page for changing user data
pageController.composeChangeUserDataPage = function(page){
    buildChangeUserDataPage(storage.userData.fullName, storage.userData.bankAccount.accountName);
    page.querySelector('#update-user-data-button').onclick = function(){changeUserData();};
};


//Method for composing content of page More-Options
pageController.composeMoreOptionsPage = function (page) {
    document.querySelector('#main-navigator').addEventListener('prepop', function(event) { 
        if (event.currentPage.id === "financial-overview-page" || event.currentPage.id === "howto-page" || event.currentPage.id === "legal-scope-page" || event.currentPage.id === "security-crossroad-page" )
            document.getElementById('tabbar').setTabbarVisibility(true);
    });  
    page.querySelector('#financial-overview-link').onclick = function(){document.getElementById('tabbar').setTabbarVisibility(false);navigationController.pushPage('moreOptionsNavigator', 'view/html/more-options-subpages/financial-overview-page.html');};
    page.querySelector('#legal-scope-link').onclick = function(){document.getElementById('tabbar').setTabbarVisibility(false);navigationController.pushPage('moreOptionsNavigator', 'view/html/more-options-subpages/legal-scope-page.html');};
    page.querySelector('#profile-link').onclick = function(){document.getElementById('tabbar').setActiveTab(1);};
    page.querySelector('#share-with-friends-link').onclick = function(){document.getElementById('tabbar').setActiveTab(3);};
    page.querySelector('#security-link').onclick = function(){document.getElementById('tabbar').setTabbarVisibility(false);navigationController.pushPage('moreOptionsNavigator', 'security-crossroad-page-template');};
    page.querySelector('#howto-page-link').onclick = function(){document.getElementById('tabbar').setTabbarVisibility(false);navigationController.pushPage('moreOptionsNavigator', 'view/html/more-options-subpages/howto-page.html');};

};

//Method for composing content of page Invite-Friends
pageController.composeInviteFriendPage = function (page) {
    // Static page, nothing to compose for now
};

// Method for composing new-contact-page
pageController.composeNewContactPage = function(page){   
    page.querySelector('#create-new-contact-button').onclick = function(){
        submitNewContact();
    };
};

// Method for showing general success action page
// Input:   navigator:  to be used as for further actions
//          action:     action that brought app to this page
pageController.showSuccessActionPage = function(navigator, action){
    console.log("Showing success page");
    storage.successAction = action;
    hideModal();
    navigationController.pushPage(navigator, 'success-action-template');
};


// General method for composing success-action-page
// Since template is general, its logic is driven by indicator storage.successAction. This attribute indicate which logic should template have.
pageController.composeSuccessActionPage = function(page){
    console.log("PageController: compose success action page");
    if (storage.successAction === "newContact"){
        var callback = function(){
            document.getElementById('tabbar').setTabbarVisibility(true);
            navigationController.resetToPage('newContactNavigator', 'phone-contacts-page-template');            
        };
        buildSuccessActionPage(page, "Úspěšně vytvořený kontakt", "Nový kontakt byl úspěšně uložen do paměti zařízení.", "Hotovo", callback);
    }
    else if (storage.successAction === "changedData"){
        console.log("PageController: changeUserData");
        var callback = function(){
            pageController.composeMainPage(document);
            document.getElementById('tabbar').setTabbarVisibility(true);
            navigationController.resetToPage('userDetailNavigator', 'user-detail-page-template');
        };
        buildSuccessActionPage(page, "Úspěšně uložená data", "Změněné uživatelské informace byly úspěšně uloženy.", "Hotovo", callback);
    }
    else if (storage.successAction === "changedPassword"){
        console.log("PageController: changedPassword");
        var callback = function(){
            document.getElementById('tabbar').setTabbarVisibility(true);
            navigationController.resetToPage('moreOptionsNavigator', 'more-options-page-template');
        };
        buildSuccessActionPage(page, "Úspěšně změněné heslo", "Nové uživatelské heslo bylo úspěšně nastaveno.", "Hotovo", callback);
    }
    else if (storage.successAction === "changedPIN"){
        console.log("PageController: changedPIN");
        var callback = function(){
            document.getElementById('tabbar').setTabbarVisibility(true);
            navigationController.resetToPage('moreOptionsNavigator', 'more-options-page-template');
        };
        buildSuccessActionPage(page, "Úspěšně změněný PIN", "Nový PIN byl uložen v paměti aplikace.", "Hotovo", callback);
    }
};

//Method for composing Phone-contacts-page
pageController.composePhoneContactsPage = function(page) {
   pageController.assemblePhoneContactList(page);
   page.querySelector('#create-contact').onclick = function(){
        document.getElementById('tabbar').setTabbarVisibility(false);
        navigationController.pushPage('newContactNavigator', 'new-contact-page-template');
    };
    document.querySelector('#newContactNavigator').addEventListener('prepop', function(event) {
        document.getElementById('tabbar').setTabbarVisibility(true);
    });
};

//Method for composing ContactListPage
pageController.composeContactListPage = function(page){
    document.getElementById('tabbar').setTabbarVisibility(false);
    pageController.assembleContactList(page);
    $(".contact-list-detail").on("click", function(){storage.transactionContactSelected($(this.querySelector('.contact-index')).text());});
    if (storage.newTransaction.transactionType === "payment"){
        buildContactListPage(page, "Přímá platba");
    }
    else if (storage.newTransaction.transactionType === "request"){
        buildContactListPage(page, "Připomínka");
    }
};

//Method for composing contactListPage - dynamic list as a part of new transaction process
pageController.assembleContactList = function(page) {
        var contacts = storage.cordovaContacts;
        var counter = 0;
        page.querySelector('#contact-list')
        .innerHTML = contacts.map(function(item)
        {
            // Condition for contact list page - to show only valid contacts
            if (page.id==='contact-list-page' && (!item.hasOwnProperty('valid') || item.valid !== true)){
                counter++;
                return '';
            }
            return "<ons-list-item modifier='tappable' class='contact-list-detail' > \
                    <div class='left contact-name'>" + item.name +" <div class='left'></div></div> \
                    <div class='center contact-phone'>" + item.phoneNumber +"</div> \
                    <div class='right'> <ons-icon class='icon' icon='ion-chevron-right'></ons-icon></div> \
                    <div class='hidden contact-index'>" + (counter++) + "</div> \
                    </ons-list-item>";
        })
        .join('');
};

// Method for composing PhoneContactList - static list accessible from main page via tabbar
// For contacts we found match in DB, checkmark is appended, to show their validity 
pageController.assemblePhoneContactList = function(page) {
        var contacts = storage.cordovaContacts;
        var counter = 0;
        page.querySelector('#contact-list')
        .innerHTML = contacts.map(function(item)
        {
            //  Contact is not user of the application, no checkmark for you, troglodyte
            if(!item.hasOwnProperty('valid') || item.valid !== true){
            console.log(item.phoneNumber + " - " + item.valid);
            return "<ons-list-item class='contact-list-detail'> \
                    <div class='left contact-name'>" + item.name +"</div> \
                    <div class='center contact-phone'>" + item.phoneNumber +"</div> \
                    <div class='right'></div> \
                    <div class='hidden contact-index'>" + (counter++) + "</div> \
                </ons-list-item>";
            }
            // Contact is user of the application, well done, give him checkmark
            else {
                console.log("PageController: Found valid contact");
                 return "<ons-list-item class='contact-list-detail'> \
                    <div class='left contact-name'>" + item.name +"</div> \
                    <div class='center contact-phone'>" + item.phoneNumber +"</div> \
                    <div class='right'><ons-icon class='valid-icon'  icon='ion-checkmark' size='20px'></ons-icon></div> \
                    <div class='hidden contact-index'>" + (counter++) + "</div> \
                </ons-list-item>";
            }
        })
        .join('');
};

//Method for building page for setting transaction amount
pageController.composeSetAmountPage = function(page){
    buildSetAmountPage(page, storage.cordovaContacts[storage.newTransaction.contactIndex].name, storage.cordovaContacts[storage.newTransaction.contactIndex].phoneNumber);
    page.querySelector('#input-amount').onchange = function(){controlAmountInput()};
    page.querySelector('#submit-transaction-button').onclick = function(){controlAmountInput();};
};


// Method for building transactionConfirmPage
pageController.composeConfirmTransactionPage = function(page) {
    if (storage.newTransaction.transactionType === "payment")
        buildConfirmTransactionPage(page, "Detail platby", "Odesílaná částka", "Zaplatit", storage.cordovaContacts[storage.newTransaction.contactIndex].name, storage.cordovaContacts[storage.newTransaction.contactIndex].phoneNumber, storage.newTransaction.amount);
    else
        buildConfirmTransactionPage(page, "Detail připomínky", "Žádaná částka", "Požádat", storage.cordovaContacts[storage.newTransaction.contactIndex].name, storage.cordovaContacts[storage.newTransaction.contactIndex].phoneNumber, storage.newTransaction.amount);
    page.querySelector('#submit-button').onclick = function(){ submitNewTransaction();};
};


// Method invoked by view, handles message and pin validation
pageController.submitNewTransaction = function(pin, message) {
    if (pin === storage.userData.pin){
        showModal();
        storage.storeNewTransactionMessage(message);
    }
    else{
        incorrectPIN();
    }
};

// Method for composing success submit page
pageController.composeSuccessSubmitPage = function(page) {
    var callback = function(){ pageController.transactionCompleted() };
    if (storage.newTransaction.transactionType === "payment")
        buildSuccessSubmitPage(page, "Úspešná platba", "Platba byla úspěšně provedena", callback);
    else
        buildSuccessSubmitPage(page, "Úspešná připomínka", "Připomínka byla úspěšně provedena", callback);
};

// Function for returning back to home page, after succesfull transaction
pageController.transactionCompleted = function(){
    storage.clearOutSystemVariables();
    document.getElementById('tabbar').setTabbarVisibility(true);
    navigationController.resetToPage('pageNavigator', 'main-page-template');
};

//Support method for showing reuqests
pageController.showRequests = function ()  {
    document.querySelector('#transaction-list').innerHTML="";
    systemVariables.filterFlag = "requests";
    this.showIncomingRequests(storage.userData.incomingRequests);
    this.showOutgoingRequests(storage.userData.outgoingRequests);
    $(".transaction-item-detail").on("click", function(){
        id = $(this).attr('id');
        elementIndex = $(this.querySelector('#transaction-index')).text();
        storage.showTransactionDetail(id, elementIndex);
        });
};

//Support method for listing incomingReuqests
pageController.showIncomingRequests = function(dataSource) {
    if (dataSource.length === 0)
        return;
        var counter = -1;
    document.querySelector('#transaction-list').innerHTML="<ons-list-header>Přijaté připomínky</ons-list-header>";
    document.querySelector('#transaction-list').innerHTML+=dataSource.map(function(item){
                 counter++;
        return "<ons-list-item modifier='tappable' id='filter-incoming-requests' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.initiatorDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + " Kč</div> \
        <div class='right'><ons-icon class='icon' icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
    $(".transaction-amount").addClass("red");
};

//Support method for showing ougoing requests
pageController.showOutgoingRequests = function(dataSource) {
    if (dataSource.length === 0)
        return;
        var counter = -1;
    document.querySelector('#transaction-list').innerHTML+="<ons-list-header>Odeslané připomínky</ons-list-header>";
    document.querySelector('#transaction-list').innerHTML+=dataSource.map(function(item){
                 counter++;
        return "<ons-list-item modifier='tappable' id='filter-outgoing-requests' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.recieverDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + " Kč</div> \
        <div class='right'><ons-icon class='icon' icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
};

// Support method for showing incoming payments
pageController.showIncomingPayments = function(page) {
    console.log("Page controller: Showing incoming payments");
    var payments = storage.userData.incomingPayments;
    var counter = -1;
    systemVariables.filterFlag = "incomingPayments";
    console.log("Mapping");
     page.querySelector('#transaction-list').innerHTML=payments.map(function(item){
         counter++;
        return "<ons-list-item modifier='tappable' id='filter-incoming-payments' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.initiatorDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + " Kč</div> \
        <div class='right'><ons-icon class='icon' icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
     $(".transaction-item-detail").on("click", function(){
        id = $(this).attr('id');
        elementIndex = $(this.querySelector('#transaction-index')).text();
        storage.showTransactionDetail(id, elementIndex);
        
        });
};

// Support method for showing outgoing payments
pageController.showOutgoingPayments = function() {
   systemVariables.filterFlag = "outgoingPayments";
    var payments = storage.userData.outgoingPayments;
    var counter = -1;
    document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
                 counter++;
        return "<ons-list-item modifier='tappable' id='filter-outgoing-payments' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.recieverDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + " Kč</div> \
        <div class='right'><ons-icon class='icon' icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');    
    $(".transaction-item-detail").on("click", function(){
        id = $(this).attr('id');
        elementIndex = $(this.querySelector('#transaction-index')).text();
        storage.showTransactionDetail(id, elementIndex);
        
        });
    $(".transaction-amount").addClass("red");
};


// Method for composing Transaction Detail Page  
pageController.composeTransactionDetailPage = function(){
    var dataSource;
    if (systemVariables.transactionType === "filter-incoming-payments") {
        dataSource = storage.userData.incomingPayments[systemVariables.elementIndex];
        this.hideIncomingRequestFields();
        this.hideOutgoingRequestFields();
        document.querySelector('#transaction-party').innerHTML = dataSource.initiatorDetail.fullName;
    }
    else if (systemVariables.transactionType === "filter-outgoing-payments"){
        dataSource = storage.userData.outgoingPayments[systemVariables.elementIndex];
        this.hideIncomingRequestFields();
        this.hideOutgoingRequestFields();
        document.querySelector('#transaction-party').innerHTML = dataSource.recieverDetail.fullName;
        }
    else if (systemVariables.transactionType === "filter-outgoing-requests"){
        this.hideIncomingRequestFields();
        dataSource = storage.userData.outgoingRequests[systemVariables.elementIndex];
        document.querySelector('#transaction-party').innerHTML = dataSource.recieverDetail.fullName;
    }
    else if (systemVariables.transactionType === "filter-incoming-requests"){
        dataSource = storage.userData.incomingRequests[systemVariables.elementIndex];
        document.querySelector('#transaction-party').innerHTML = dataSource.initiatorDetail.fullName;
        this.hideOutgoingRequestFields();
    }   
   document.querySelector('#transaction-amount').innerHTML = dataSource.amount;
   document.querySelector('#transaction-message').innerHTML = dataSource.message;
    var submitDate = getDate(dataSource.submitDate);
   document.querySelector('#transaction-date').innerHTML = submitDate;
};

//Function for converting date to right format
// Input: timestamp: date in format of miliseconds
getDate = function(timestamp){
    console.log(timestamp + ", " + typeof timestamp);
     var today = new Date(Number(timestamp));
    console.log("Today " + today);
    var dd = today.getDate();
    console.log("Day " + dd);
    var mm = today.getMonth()+1; //January is 0!
    console.log("Month " + mm);
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd;
    } 
    if(mm<10) {
        mm='0'+mm;
    } 
    today = dd+'. '+mm+'. '+yyyy;
    return today;
};


// Support method for hidding incoming requests
pageController.hideIncomingRequestFields = function() {
    $('#response-message-field').hide();
    $('#incoming-requests-action-buttons').hide();
    $('#request-pin-header').hide();
    $('#request-pin-body').hide();
};

// Support method for hidding outgoing requests
pageController.hideOutgoingRequestFields = function() {
    $('#outgoing-requests-action-buttons').hide();
};

pageController.composeFinancialOverviewPage = function(page){
    console.log("PageController: Composing Financial overviewPage");
    var incomingPayments = transactionController.countSumOfIncomingPayments();
    var outgoingPayments = transactionController.countSumOfOutgoingPayments();
    var incomingRequests = transactionController.countIncomingRequest();
    var outgoingRequests = transactionController.countOutgoingRequests();
    buildFinancialOverviewPage(page, incomingPayments, outgoingPayments, incomingRequests, outgoingRequests);
};

// Method for composing security crossroad page
pageController.composeSecurityCrossroadPage = function(page){
    page.querySelector('#user-password-change-link').onclick = function(){
        navigationController.pushPage('moreOptionsNavigator', 'change-password-page-template');
    };
    page.querySelector('#pin-change-link').onclick = function(){
        navigationController.pushPage('moreOptionsNavigator', 'change-pin-page-template');
    };
};

// Method for composing change password page
pageController.composeChangePasswordPage = function(page){
    // Empty for now
};

// Method for composing change password page
pageController.composeChangePINPage = function(page){
    // Empty for now
};

// Method for updating displayed account-balance
pageController.changeAccountBalanceDisplay = function (){
    console.log("Page controller: Updata balance");
    updateAccountBalance(storage.userData.accountBalance);
};

// Method for enhance display of new transaction
pageController.lightUp = function (collection){
    console.log("Lighting up");
    if (currentFilter === collection){
        $(".transaction-item-detail").first().addClass("lighten-up");
    }
};

// Method for lightihg down enhanced transaction
pageController.lightDown = function (){
    console.log("Page Controller: Lighting down");
    $(".transaction-item-detail").first().removeClass("lighten-up");
};