// Page controller
// This class has responsibility for composing all content of pages
// Created by: David Kukacka

// Method for composing register outcome page
pageController.composeRegisterOutcomePage = function(page) {
    console.log("Composing registration outcome page");
    console.log(JSON.stringify(storage.registrationOutcome));
    if (storage.registrationOutcome === 'success'){
        page.querySelector('#register-outcome-header').innerHTML = "Úspěšná registrace";
        page.querySelector('#register-outcome-image').innerHTML = '<ons-icon icon="ion-checkmark-circled" size="90px" class="center-block green-icon"></ons-icon>';
        page.querySelector('#register-outcome-text').innerHTML = "Registrace proběhla úspěšně. Nyní se můžete přihlásit do aplikace.";
        
    }
    else{
        page.querySelector('#register-outcome-header').innerHTML = "Neúspěšná registrace";
        page.querySelector('#register-outcome-image').innerHTML = '<ons-icon icon="ion-close-circled" size="90px" class="center-block red-icon"></ons-icon>';
        page.querySelector('#register-outcome-text').innerHTML = "Registrace proběhla neúspěšně. Vámi zadané údaje nejsou v aplikaci jedinečné.";
    }
};


//Method for composing main page
pageController.composeMainPage = function (page) {
        document.getElementById('tabbar').setTabbarVisibility(true);
        console.log("Composing main page");
        page.querySelector('#account-name').innerHTML = storage.userData.bankAccount.accountName;
        page.querySelector('#account-number').innerHTML = storage.userData.bankAccount.accountPrefix + "-" + storage.userData.bankAccount.accountNumber + "/" + storage.userData.bankAccount.bankCode;
        page.querySelector('#account-balance').innerHTML = storage.userData.accountBalance + " Kč";
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
        contactManager.runTest();    
    });  
};

//Method for composing page with user detail
pageController.composeUserDetailPage = function(page) {
    page.querySelector('#username-line').innerHTML = storage.userData.fullName;
    page.querySelector('#phone-number-line').innerHTML = storage.userData.phoneNumber;
    page.querySelector('#account-name-line').innerHTML = storage.userData.bankAccount.accountName;
    page.querySelector('#account-number-line').innerHTML = storage.userData.bankAccount.accountPrefix + "-" + storage.userData.bankAccount.accountNumber;
    page.querySelector('#bank-code-line').innerHTML = storage.userData.bankAccount.bankCode;
};

//Method for composing content of page More-Options
pageController.composeMoreOptionsPage = function (page) {
    page.querySelector('#recievers-name3').innerHTML = storage.userData.fullName;  
    page.querySelector('#recievers-phone3').innerHTML = storage.userData.contact.phone;  
    page.querySelector('#recievers-email3').innerHTML = storage.userData.contact.email;  
    page.querySelector('#howto-page-link').onclick = function(){moreOptionsSwitchPage('view/html/more-options-subpages/howto-page.html')};
    page.querySelector('#financial-overview-link').onclick = function(){moreOptionsSwitchPage('view/html/more-options-subpages/financial-overview-page.html')};
    page.querySelector('#legal-scope-link').onclick = function(){moreOptionsSwitchPage('view/html/more-options-subpages/legal-scope-page.html')};
};

//Method for composing content of page Invite-Friends
pageController.composeInviteFriendPage = function (page) {
    // Static page, nothing to compose for now
};

//Method for composing Phone-contacts-page
pageController.composePhoneContactsPage = function(page) {
   pageController.assembleContactList(page);
};

//Method for composing ContactListPage
pageController.composeContactListPage = function(page){
    document.getElementById('tabbar').setTabbarVisibility(false);
    pageController.assembleContactList(page);
    console.log("Composing contact list page");
    $(".contact-list-detail").on("click", function(){storage.transactionContactSelected($(this.querySelector('.contact-index')).text());});
    if (storage.newTransaction.transactionType === "payment"){
        page.querySelector('#page-title').innerHTML = "Přímá platba";
    }
    else if (storage.newTransaction.transactionType === "request"){
        page.querySelector('#page-title').innerHTML = "Připomínka";
    }
    else
        console.log("Something went wrong");
};

//Method shared by phoneContactPage and contactListPage for assembling contactList
pageController.assembleContactList = function(page) {
    if (storage.cordovaIndicator != true){
        console.log("Loading BE contact list: " + storage.cordovaIndicator);
    var contacts = storage.contactList;
    var counter = 0;
    page.querySelector('#contact-list')
        .innerHTML = contacts.map(function(item)
        {
            return page.querySelector('#contact-list-item')
                .innerHTML.replace('{{name}}', item.name)
                .replace('{{phoneNumber}}', item.contact.phone)
                .replace('{{index}}', counter++);        
        })
        .join('');
    }
    else {
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
    }
};

//Method for building page for setting transaction amount
pageController.composeSetAmountPage = function(page){
    /* BEFORE - CONTACTS FROM BACKEND
    page.querySelector('#recievers-name').innerHTML = storage.contactList[storage.newTransaction.contactIndex].fullName;  
    page.querySelector('#recievers-phone').innerHTML = storage.contactList[storage.newTransaction.contactIndex].contact.phone;  
    page.querySelector('#recievers-email').innerHTML = storage.contactList[storage.newTransaction.contactIndex].contact.email;  
    page.querySelector('#input-amount').onchange = function(){pageController.controlAmountInput()}; //ADD BALANCE CHECK
    page.querySelector('#submit-transaction-button').onclick = function(){pageController.controlAmountInput();};
    */
    page.querySelector('#recievers-name').innerHTML = storage.cordovaContacts[storage.newTransaction.contactIndex].name;  
    page.querySelector('#recievers-phone').innerHTML = storage.cordovaContacts[storage.newTransaction.contactIndex].phoneNumber;  
    // Following should be controlled, whether exists or not display at all
    //page.querySelector('#recievers-email').innerHTML = storage.contactList[storage.newTransaction.contactIndex].contact.email;  
    page.querySelector('#input-amount').onchange = function(){pageController.controlAmountInput()}; //ADD BALANCE CHECK
    page.querySelector('#submit-transaction-button').onclick = function(){pageController.controlAmountInput();};
};

//Support method for veryfing, whether set balance is OK
pageController.controlAmountInput = function() {
  var amount = document.querySelector('#input-amount').value;
  if ( $.isNumeric(amount) && amount <= storage.userData.accountBalance && amount > 0 ){
    document.querySelector('#submit-transaction-button').disabled=false;
        $('#input-amount').removeClass("incorrect-input-field");
        $('#input-amount').addClass("correct-input-field");
        document.querySelector('#insufficientBalanceNote').innerHTML = "";
        storage.newTransaction.amount = amount;  // SHOULD HANDLE MODEL    
        navigationController.switchPage('view/html/confirm-transaction-page.html');
        return;
    }
    else if (amount > storage.userData.accountBalance)
        pageController.showInsufficientBalanceNote();
    document.querySelector('#submit-transaction-button').disabled=true;
    $('#input-amount').removeClass("correct-input-field");
    $('#input-amount').addClass("incorrect-input-field");
};

pageController.showInsufficientBalanceNote = function(){
    console.log("Showing insufficient balance note");
    document.querySelector('#insufficientBalanceNote').innerHTML = "Nemáte na účtě dostatečný zůstatek.";
};



//Method for building page for defining transactionDetail
pageController.composeDefineTransactionPage = function(page) {
    if (storage.newTransaction.transactionType === "payment")
        page.querySelector('#page-header').innerHTML = "New payment";
    else if (storage.newTransaction.transactionType === "request")
        page.querySelector('#page-header').innerHTML = "New request";
};

// Method for building transactionConfirmPage
pageController.composeConfirmTransactionPage = function(page) {
    console.log("Composing confirm transaction page") ;
    console.log("Reciever: " + storage.cordovaContacts[storage.newTransaction.contactIndex].name) ;
    console.log("Phone: " + storage.cordovaContacts[storage.newTransaction.contactIndex].phoneNumber) ;
    console.log("Amount: " + storage.newTransaction.amount);
    console.log("Type: " + storage.newTransaction.transactionType);
    if (storage.newTransaction.transactionType === "payment")
        pageController.composeConfirmTransactionPaymentPage(page);
    else 
        pageController.composeConfirmTransactionRequestPage(page);
    page.querySelector('#recievers-name2').innerHTML = storage.cordovaContacts[storage.newTransaction.contactIndex].name;    
    page.querySelector('#recievers-phone2').innerHTML = storage.cordovaContacts[storage.newTransaction.contactIndex].phoneNumber;    
    console.log("Name and phone assembled");
    page.querySelector('#transaction-amount').innerHTML = storage.newTransaction.amount+ " Kč";
    page.querySelector('#submit-button').onclick = function(){ storage.verifyPIN(document.querySelector('#pin-input').value, document.querySelector('#message-input').value);};
};

//Support method for building compose confirm page - payment
pageController.composeConfirmTransactionPaymentPage = function(page){
    page.querySelector('#page-header').innerHTML = "Detail platby";
    page.querySelector('#transaction-amount-header').innerHTML = "Odesílaná částka";    
    page.querySelector('#submit-button').innerHTML = "Zaplatit";
    console.log("Payment page titles builded");
};

//Support method for building compose confirm page - transaction
pageController.composeConfirmTransactionRequestPage = function(page){
    page.querySelector('#page-header').innerHTML = "Detail připomínky";
    page.querySelector('#transaction-amount-header').innerHTML = "Žádaná částka";    
    page.querySelector('#submit-button').innerHTML = "Požádat";
};

// Method for composing success submit page
pageController.composeSuccessSubmitPage = function(page) {
    if (storage.newTransaction.transactionType === "payment") {
        page.querySelector('#success-submit-header').innerHTML = successSubmitHeaderPayment;
        page.querySelector('#success-submit-message').innerHTML = successSubmitMessagePayment;        
    }
    else {
        page.querySelector('#success-submit-header').innerHTML = successSubmitHeaderRequest;
        page.querySelector('#success-submit-message').innerHTML = successSubmitMessageRequest;
    }
    page.querySelector('#transaction-success-image').innerHTML = '<ons-icon icon="ion-checkmark-circled" size="90px" class="center-block green-icon"></ons-icon>';
    document.getElementById('tabbar').setTabbarVisibility(false);
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



