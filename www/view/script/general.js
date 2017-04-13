// This file contanis javascript functions of view - functions which alter DOM, yet bear no application logic


// Function for showing modal window, when application might be loading data longer time
showModal = function()
{
    var modal = document.getElementById('modal');
    modal.show();
};


// Function for showing hidding modal window, when application is ready
hideModal = function()
{
    var modal = document.getElementById('modal');
    modal.hide();
};


/*-------- LOGIN TEMPLATE VIEW ACTIONS ----------*/
// Function for logging user
// - function calls login-controller for login asociated business logic
function loginUser()
{
    var username = document.querySelector('#login-username')
        .value;
    var password = document.querySelector('#login-password')
        .value;
    loginController.login(username, password);
}


// Function for warning user, that not all credentials are submitted while logging-in
// - view notifies user by displaying warning
showIncompleteLoggingInfo = function()
{
    document.querySelector('#login-note')
        .innerHTML = "Pro přihlášení musíte vyplnit Uživatelské jméno a Heslo";
};


// Function for displaying warning in case of failed authentication
showFailedAuthorizationNote = function()
{
    console.log("Showing authentication failed note");
    document.querySelector('#login-note')
        .innerHTML = "Špatné Uživatelské jméno nebo Heslo";
    document.querySelector('#login-username')
        .value = "";
    document.querySelector('#login-password')
        .value = "";
};

/*-------- SUBMIT REGISTRATION TEMPLATE VIEW ACTIONS ----------*/

// Function for submitting user registration
// - parsed content is handed over to loginController
submitRegistration = function()
{
    var newUser = {};
    var bankAccount = {};
    newUser.username = document.querySelector('#register-email').value;
    newUser.forename = document.querySelector('#register-forename').value;
    newUser.surname = document.querySelector('#register-surname').value;
    newUser.phoneNumber = document.querySelector('#register-phone').value;
    bankAccount.accountPrefix = document.querySelector('#register-prefix').value;
    bankAccount.accountNumber = document.querySelector('#register-account').value;
    bankAccount.bankCode = document.querySelector('#register-bankCode').value;
    bankAccount.accountName = "Můj účet";
    newUser.password = document.querySelector('#register-password').value;
    newUser.pin = document.querySelector('#register-pin').value;
    if (newUser.username === "" || newUser.forename === "" || newUser.surname === "" || newUser.phoneNumber === "" || bankAccount.accountNumber === "" || bankAccount.accountName === "" || bankAccount.bankCode === "" || newUser.password === "" || newUser.pin==="")
    {
        if (newUser.phoneNumber === ""){
            alert("Phone number error: \'" + newUser.phoneNumber +  "\'");
        }
        registrationIncomplete();
         return;
    }
    newUser.phoneNumber = contactManager.transform(newUser.phoneNumber);
    newUser.bankAccount = bankAccount;
    loginController.submitRegistration(newUser);
};

// Function for showing message, when not all data are submitted
registrationIncomplete = function()
{
    ons.notification.alert({message: 'Všechna pole musí být vyplněna!',title: "Upozornění"});
};

/*-------- REGISTRATION OUTCOME TEMPLATE VIEW ACTIONS ----------*/

// Function for building content of registration-outcome-template, when registration is succesfull
function buildSuccesfullRegistrationOutcomePage(page)
{
    page.querySelector('#register-outcome-header').innerHTML = "Úspěšná registrace";
    page.querySelector('#register-outcome-image').innerHTML = '<ons-icon icon="ion-checkmark-circled" size="90px" class="center-block green-icon"></ons-icon>';
    page.querySelector('#register-outcome-text').innerHTML = "Registrace proběhla úspěšně. Nyní se můžete přihlásit do aplikace.";
};
// Function for building content of registration-outcome-template, when registration is not succesfull
function buildUnsuccesfullRegistrationOutcomePage(page)
{
    page.querySelector('#register-outcome-header').innerHTML = "Neúspěšná registrace";
    page.querySelector('#register-outcome-image').innerHTML = '<ons-icon icon="ion-close-circled" size="90px" class="center-block red-icon"></ons-icon>';
    page.querySelector('#register-outcome-text').innerHTML = "Registrace proběhla neúspěšně. Vámi zadané údaje nejsou v aplikaci jedinečné.";
};

/*-------- MAIN PAGE TEMPLATE VIEW ACTIONS ----------*/

// Function for building main-page view
function buildMainPage(page, accountName, accountNumber, balance){
    console.log("Building main page");
    page.querySelector('#account-name').innerHTML = accountName;
    page.querySelector('#account-number').innerHTML = accountNumber; 
    page.querySelector('#account-balance').innerHTML = balance + " Kč";
};

/*-------- USER DETAIL PAGE TEMPLATE VIEW ACTIONS ----------*/
// Function for building user-detail view
function buildUserDeatilPage(page, userName, phoneNumber, accountName, accountNumber, bankCode, userData){
    page.querySelector('#username-line').innerHTML = userName;
    page.querySelector('#phone-number-line').innerHTML = phoneNumber;
    page.querySelector('#account-name-line').innerHTML = accountName;
    page.querySelector('#account-number-line').innerHTML = accountNumber;
    page.querySelector('#bank-code-line').innerHTML = bankCode;
}

/*-------- MORE OPTIONS PAGE TEMPLATE VIEW ACTIONS ----------*/
// Function for building user-detail view
    function buildMoreOptionsPage(fullName, phone, email){
    page.querySelector('#recievers-name3').innerHTML = fullName;  
    page.querySelector('#recievers-phone3').innerHTML = phone;  
    page.querySelector('#recievers-email3').innerHTML = email;  
};

/*-------- CONTACT LIST PAGE TEMPLATE VIEW ACTIONS ----------*/
// Function for building header of contact-list-page
function buildContactListPage(page, title){
    page.querySelector('#page-title').innerHTML = title;
}

/*-------- SET AMOUNT PAGE TEMPLATE VIEW ACTIONS ----------*/
// Function for building content of set-amount-page
function buildSetAmountPage(page, name, phoneNumber){
    page.querySelector('#recievers-name').innerHTML = name;  
    page.querySelector('#recievers-phone').innerHTML = phoneNumber;  
};

// Function for controlling, whether user set valid transaction amount 
function controlAmountInput (){
  var amount = document.querySelector('#input-amount').value;
  pageController.controlAmountInput(amount);
};

// Function for altering view, when user entered valid amount
function amountSetCorrectly(){
   document.querySelector('#submit-transaction-button').disabled=false;
   $('#input-amount').removeClass("incorrect-input-field");
   $('#input-amount').addClass("correct-input-field");
   document.querySelector('#insufficientBalanceNote').innerHTML = "";
};

// Function for altering view, when user entered invalid amount
function amountSetIncorrectly(){
    document.querySelector('#submit-transaction-button').disabled=true;
    $('#input-amount').removeClass("correct-input-field");
    $('#input-amount').addClass("incorrect-input-field");
};

// Function for alterign view, when user set higher amount then his accountBalance
function showInsufficientBalanceNote (){
    document.querySelector('#insufficientBalanceNote').innerHTML = "Nemáte na účtě dostatečný zůstatek.";
};

/*-------- CONFIRM TRANSACTION PAGE TEMPLATE VIEW ACTIONS ----------*/

// function for building up confirm transaction page
function buildConfirmTransactionPage (page, title, amountHeader, action, name, phoneNumber, amount){
    page.querySelector('#page-header').innerHTML = title;
    page.querySelector('#transaction-amount-header').innerHTML = amountHeader;    
    page.querySelector('#submit-button').innerHTML = action;
    page.querySelector('#recievers-name2').innerHTML = name;    
    page.querySelector('#recievers-phone2').innerHTML = phoneNumber;
    page.querySelector('#transaction-amount').innerHTML = amount + " Kč";
};

//Function invoked by pressing submit button, handles view logic of invokation
function submitNewTransaction() {
    var pin = document.querySelector('#pin-input').value;
    var message = document.querySelector('#message-input').value;
    pageController.submitNewTransaction(pin, message);
};

// Function for displaying, that set pin is not valid
function incorrectPIN(){
    $('#pin-input').addClass("incorrect-pin");  
    document.querySelector('#pin-input').value = "";
};

/*-------- BUILD SUCCESS SUBMIT PAGE TEMPLATE VIEW ACTIONS ----------*/
// function for building success-submit-page
function buildSuccessSubmitPage(page, title, message){
    page.querySelector('#success-submit-header').innerHTML = title;
    page.querySelector('#success-submit-message').innerHTML = message;       
    page.querySelector('#transaction-success-image').innerHTML = '<ons-icon icon="ion-checkmark-circled" size="90px" class="center-block green-icon"></ons-icon>';

}
