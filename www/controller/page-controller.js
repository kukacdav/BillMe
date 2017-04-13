// Page controller
// This class has responsibility for composing all content of pages
// Created by: David Kukacka

// Method for composing register outcome page
pageController.composeRegisterOutcomePage = function(page) {
    console.log("Composing registration outcome page");
    if (storage.registrationOutcome === 'success'){
        buildSuccesfullRegistrationOutcomePage(page);
    }
    else{
        buildUnsuccesfullRegistrationOutcomePage(page);
    }
};


//Method for composing main page
pageController.composeMainPage = function (page) {
        document.getElementById('tabbar').setTabbarVisibility(true);
        var accountNumber = storage.userData.bankAccount.accountPrefix + "-" + storage.userData.bankAccount.accountNumber + "/" + storage.userData.bankAccount.bankCode;
        var balance = storage.userData.accountBalance;
        buildMainPage(page, storage.userData.bankAccount.accountName, accountNumber, balance );        
        page.querySelector('#create-payment-button').onclick = function(){storage.createNewTransaction("payment");};
        page.querySelector('#create-request-button').onclick = function(){storage.createNewTransaction("request");};
        page.querySelector('#incoming-payments-filter').onclick = function(){activateIncomingPayments();pageController.showIncomingPayments();};
        page.querySelector('#outgoing-payments-filter').onclick = function(){activateOutgoingPayments();pageController.showOutgoingPayments();};
        page.querySelector('#unresolved-transactions-filter').onclick = function(){activateUnresolvedTransactions(); pageController.showRequests();};
        pageController.showIncomingPayments();
        document.querySelector('#main-navigator').addEventListener('prepop', function(event) {
        if(event.currentPage.id === "contact-list-page" || event.currentPage.id === 'transaction-detail-page' ) {
            document.getElementById('tabbar').setTabbarVisibility(true);
        }
    });  
};


//Method for composing page with user detail
pageController.composeUserDetailPage = function(page) {
    $("#alter-user-action-buttons").hide();
    // For user data change: $("#change-user-data").empty().append("Upravit");
    var accountNumber = storage.userData.bankAccount.accountPrefix + "-" + storage.userData.bankAccount.accountNumber;
    buildUserDeatilPage(page, storage.userData.fullName, storage.userData.phoneNumber, storage.userData.bankAccount.accountName, accountNumber, storage.userData.bankAccount.bankCode);
    // For user data change page.querySelector('#change-user-data').onclick = function(){pageController.allowUserDataChange();};
    
};

/* FOR CHANGE of user data
// Mthod for changing user-detail-page to editable mode
pageController.allowUserDataChange = function(){
    $("#alter-user-action-buttons").show();
    $("#change-user-data").empty().append("Uložit");
    console.log("user data change mode");
    document.querySelector('#username-line').innerHTML = "";
    document.querySelector('#account-name-line').innerHTML = "";
    $('<ons-input id="new-username" class="right" float></ons-input><ons-icon  class="icon" icon="ion-edit" size="20px"></ons-icon>').appendTo("div#username-line");
    $("#new-username").attr('placeholder', storage.userData.fullName);
    $('<ons-input id="new-accountName" class="right"  float></ons-input><ons-icon  class="icon" icon="ion-edit" size="20px"></ons-icon>').appendTo("div#account-name-line");
    $("#new-accountName").attr('placeholder', storage.userData.bankAccount.accountName);
    page.querySelector('#change-user-data').onclick = function(){pageController.changeUserData();};
};

// Method for changing user data
pageController.changeUserData = function() {
    var newName = document.querySelector('#new-username').value;
    var newAccountName = document.querySelector('#new-accountName').value;
    console.log(newName);
    console.log(newAccountName);
    storage.changeUserData(newName, newAccountName);
};*/

//Method for composing content of page More-Options
pageController.composeMoreOptionsPage = function (page) {
    buildMoreOptionsPage(storage.userData.fullName, storage.userData.contact.phone, storage.userData.contact.email);
    page.querySelector('#howto-page-link').onclick = function(){moreOptionsSwitchPage('view/html/more-options-subpages/howto-page.html')};
    page.querySelector('#financial-overview-link').onclick = function(){moreOptionsSwitchPage('view/html/more-options-subpages/financial-overview-page.html')};
    page.querySelector('#legal-scope-link').onclick = function(){moreOptionsSwitchPage('view/html/more-options-subpages/legal-scope-page.html')};
};

//Method for composing content of page Invite-Friends
pageController.composeInviteFriendPage = function (page) {
    // Static page, nothing to compose for now
};

// Method for composing new-contact-page
pageController.composeNewContactPage = function(page){   
    page.querySelector('#create-new-contact-button').onclick = function(){
        var name = document.querySelector('#new-contact-name').value;
        var phone = document.querySelector('#new-contact-number').value;
        contactManager.submitNewContact(name, phone);
        navigationController.popPage('newContactNavigator');
    };
};

//Method for composing Phone-contacts-page
pageController.composePhoneContactsPage = function(page) {
   pageController.assembleContactList(page);
   page.querySelector('#create-contact').onclick = function(){
        document.getElementById('tabbar').setTabbarVisibility(false);
        navigationController.pushPage('new-contact-navigator', 'new-contact-page-template');
    };
    document.querySelector('#new-contact-navigator').addEventListener('prepop', function(event) {
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

//Method shared by phoneContactPage and contactListPage for assembling contactList
pageController.assembleContactList = function(page) {
        console.log("Loading phone contact list: " + storage.cordovaIndicator);
        var contacts = storage.cordovaContacts;
        console.log("Showing cordova contacts!");
        var counter = 0;
        page.querySelector('#contact-list')
        .innerHTML = contacts.map(function(item)
        {
            // Condition for contact list page - to show only valid contacts
            if (page.id==='contact-list-page' && (!item.hasOwnProperty('valid') || item.valid !== true)){
                counter++;
                return '';
            }
            if(!item.hasOwnProperty('valid') || item.valid !== true){
            console.log(item.phoneNumber + " - " + item.valid);
            return page.querySelector('#contact-list-item')
                .innerHTML.replace('{{name}}', item.name)
                .replace('{{indicator}}', '')
                .replace('{{phoneNumber}}', item.phoneNumber)
                .replace('{{index}}', counter++); 
            }
            else {
                console.log("PageController: Found valid contact");
                return page.querySelector('#contact-list-item')
                .innerHTML
                .replace('{{name}}', item.name)
                .replace('{{indicator}}', '<ons-icon class="valid-icon" icon="ion-checkmark" size="20px"></ons-icon>')
                .replace('{{phoneNumber}}', item.phoneNumber)
                .replace('{{index}}', counter++);
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

//Support method for veryfing, whether set balance is OK
pageController.controlAmountInput = function(amount) {
  if ( $.isNumeric(amount) && amount <= storage.userData.accountBalance && amount > 0 ){
        amountSetCorrectly();
        storage.newTransaction.amount = amount; 
        navigationController.switchPage('view/html/confirm-transaction-page.html');
        return;
    }
    else if (amount > storage.userData.accountBalance) 
        showInsufficientBalanceNote();
    amountSetIncorrectly();
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
    if (pin === storage.userData.pin)
        storage.storeNewTransactionMessage(message);
    else{
        console.log("inncorrect pin!!!, expected:" + storage.userData.pin );
        incorrectPIN();
    }
};

// CHECKPOINT

// Method for composing success submit page
pageController.composeSuccessSubmitPage = function(page) {
    if (storage.newTransaction.transactionType === "payment")
        buildSuccessSubmitPage(page, "Úspešná platba", "Platba byla úspěšně provedena");
    
    else
        buildSuccessSubmitPage(page, "Úspešná připomínka", "Úspěšná připomínka");
    document.querySelector('#transaction-success-button').onclick = function() {
        storage.clearOutSystemVariables();
        navigationController.resetToMainPage();
    };
};


//Support method for showing reuqests
pageController.showRequests = function ()  {
    console.log("Page controller: Showing requests");
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
        return "<ons-list-item id='filter-incoming-requests' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.initiatorDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + " Kč</div> \
        <div class='right'><ons-icon class='icon' icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
};

//Support method for showing ougoing requests
pageController.showOutgoingRequests = function(dataSource) {
    if (dataSource.length === 0)
        return;
        var counter = -1;
    document.querySelector('#transaction-list').innerHTML+="<ons-list-header>Odeslané připomínky</ons-list-header>";
    document.querySelector('#transaction-list').innerHTML+=dataSource.map(function(item){
                 counter++;
        return "<ons-list-item id='filter-outgoing-requests' class='transaction-item-detail'> \
        <div class='left transaction-party'>" + item.recieverDetail.fullName + "</div> \
        <div class='center transaction-amount'>" + item.amount + " Kč</div> \
        <div class='right'><ons-icon class='icon' icon='ion-chevron-right'></ons-icon></div> \
        <div id='transaction-index' class='hidden'>" + counter + "</div> \
        </ons-list-item>";
    }).join('');
};

// Support method for showing incoming payments
pageController.showIncomingPayments = function() {
    var payments = storage.userData.incomingPayments;
    var counter = -1;
    systemVariables.filterFlag = "incomingPayments";
     document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
         counter++;
        return "<ons-list-item id='filter-incoming-payments' class='transaction-item-detail'> \
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
        return "<ons-list-item id='filter-outgoing-payments' class='transaction-item-detail'> \
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
