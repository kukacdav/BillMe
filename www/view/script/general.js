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
    newUser.phoneNumber = transform(newUser.phoneNumber);
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
