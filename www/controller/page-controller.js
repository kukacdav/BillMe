// This is a JavaScript file

//Method for composing main page
pageController.composeMainPage = function (page) {
        document.getElementById('tabbar').setTabbarVisibility(true);
        console.log("Composing main page");
        page.querySelector('#account-name').innerHTML = storage.userData.bankAccount.accountName;
        page.querySelector('#account-number').innerHTML = storage.userData.bankAccount.accountPrefix + "-" + storage.userData.bankAccount.accountNumber + "/" + storage.userData.bankAccount.bankCode;
        page.querySelector('#account-balance').innerHTML = storage.userData.bankAccount.accountBalance;
        page.querySelector('#create-payment-button').onclick = function(){storage.createNewTransaction("payment");};
        page.querySelector('#create-request-button').onclick = function(){storage.createNewTransaction("request");};
        page.querySelector('#incoming-payments-filter').onclick = function(){activateIncomingPayments();pageController.showIncomingPayments();};
        page.querySelector('#outgoing-payments-filter').onclick = function(){activateOutgoingPayments();pageController.showOutgoingPayments();};
        page.querySelector('#unresolved-transactions-filter').onclick = function(){activateUnresolvedTransactions(); pageController.showRequests();};
        pageController.showIncomingPayments();
        document.querySelector('#pageNavigator').addEventListener('prepop', function(event) {
        if(event.currentPage.id === "contact-list-page") {
            document.getElementById('tabbar').setTabbarVisibility(true);
        }
    });  
};

//Method for composing page with user detail
pageController.composeUserDetailPage = function(page) {
    page.querySelector('#username-line').innerHTML = storage.userData.fullName;
    page.querySelector('#phone-number-line').innerHTML = storage.userData.contact.phone;
    page.querySelector('#email-line').innerHTML = storage.userData.contact.email;
    page.querySelector('#facebook-contact-line').innerHTML = storage.userData.contact.facebook;
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
    $(".contact-list-detail").on("click", navigationController.showContactListDetail);
    if (systemVariables.newTransaction.transactionType === "payment"){
        page.querySelector('#page-title').innerHTML = "Přímá platba";
    }
    else if (systemVariables.newTransaction.transactionType === "request"){
        page.querySelector('#page-title').innerHTML = "Připomínka";
    }
    else
        console.log("Something went wrong");
};

//Method shared by phoneContactPage and contactListPage for assembling contactList
pageController.assembleContactList = function(page) {
    var contacts = storage.contactList;
    var counter = 0;
    page.querySelector('#contact-list')
        .innerHTML = contacts.map(function(item)
        {
            return page.querySelector('#contact-list-item')
                .innerHTML.replace('{{name}}', item.fullName)
                .replace('{{phoneNumber}}', item.contact.phone)
                .replace('{{index}}', counter++);        
        })
        .join('');
};

//Method for building page for setting transaction amount
pageController.composeSetAmountPage = function(page){
    page.querySelector('#recievers-name').innerHTML = storage.contactList[systemVariables.newTransactionItem].fullName;  
    page.querySelector('#recievers-phone').innerHTML = storage.contactList[systemVariables.newTransactionItem].contact.phone;  
    page.querySelector('#recievers-email').innerHTML = storage.contactList[systemVariables.newTransactionItem].contact.email;  
    page.querySelector('#input-amount').onchange = function(){controlAmountInput()};
    page.querySelector('#submit-transaction-button').onclick = function(){navigationController.switchPage('view/html/confirm-transaction-page.html')};
};

//Method for building page for defining transactionDetail
pageController.composeDefineTransactionPage = function(page) {
    if (systemVariables.newTransaction.transactionType === "payment")
        page.querySelector('#page-header').innerHTML = "New payment";
    else if (systemVariables.newTransaction.transactionType === "request")
        page.querySelector('#page-header').innerHTML = "New request";
};

// Method for building transactionConfirmPage
pageController.composeConfirmTransactionPage = function(page) {
    if (systemVariables.newTransaction.transactionType === "payment")
        pageController.composeConfirmTransactionPaymentPage(page);
    else 
        pageController.composeConfirmTransactionRequestPage(page);
    page.querySelector('#recievers-name2').innerHTML = storage.contactList[systemVariables.newTransactionItem].fullName;  
    page.querySelector('#recievers-phone2').innerHTML = storage.contactList[systemVariables.newTransactionItem].contact.phone;  
    page.querySelector('#recievers-email2').innerHTML = storage.contactList[systemVariables.newTransactionItem].contact.email;  
    page.querySelector('#transaction-amount').innerHTML = systemVariables.newTransaction.amount+ " Kč";
    page.querySelector('#submit-button').onclick = function(){ storage.storeNewTransactionMessage(document.querySelector('#message-input').value);};
};

//Support method for building compose confirm page - payment
pageController.composeConfirmTransactionPaymentPage = function(page){
    page.querySelector('#page-header').innerHTML = confirmTransactionPaymentHeader;
    page.querySelector('#transaction-amount-header').innerHTML = paymentAmountHeader;    
    page.querySelector('#submit-button').innerHTML = submitPaymentButton;
};

//Support method for building compose confirm page - transaction
pageController.composeConfirmTransactionRequestPage = function(page){
    page.querySelector('#page-header').innerHTML = confirmTransactionRequestHeader;
    page.querySelector('#transaction-amount-header').innerHTML = requestAmountHeader;    
    page.querySelector('#submit-button').innerHTML = submitRequestButton;
};

// Method for composing success submit page
pageController.composeSuccessSubmitPage = function(page) {
    if (systemVariables.newTransaction.transactionType === "payment") {
        page.querySelector('#success-submit-header').innerHTML = successSubmitHeaderPayment;
        page.querySelector('#success-submit-message').innerHTML = successSubmitMessagePayment;
    }
    else {
        page.querySelector('#success-submit-header').innerHTML = successSubmitHeaderRequest;
        page.querySelector('#success-submit-message').innerHTML = successSubmitMessageRequest;
    }
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
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
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
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
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
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
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
        <div class='center transaction-amount'>" + item.amount + "</div> \
        <div class='center transaction-state' style='margin-left: 1em'>" + item.state + "</div> \
        <div class='right'><ons-icon icon='ion-chevron-right'></ons-icon></div> \
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
   document.querySelector('#transaction-state').innerHTML = dataSource.state;
   document.querySelector('#transaction-message').innerHTML = dataSource.message;
   var submitDate = new Date(dataSource.date);
   document.querySelector('#transaction-date').innerHTML = submitDate.toString('yyyy-MM-d-h-mm-ss');
};

// Support method for hidding incoming requests
pageController.hideIncomingRequestFields = function() {
    $('#response-message-field').hide();
    $('#incoming-requests-action-buttons').hide();
};

// Support method for hidding outgoing requests
pageController.hideOutgoingRequestFields = function() {
    $('#outgoing-requests-action-buttons').hide();
};



