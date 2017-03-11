var storage = {
    userData: {},
    incomingRequests: [],
    outgoingRequests: [],
    incomingPayments: [],
    outgoingPayments: [],
    userContact: {},
    account: {},
    transaction: {},
    contactList: [],
    newTransaction: {
        recieverDetail: {}
    }
};
var systemVariables = {
    newTransaction: {}
};

var communicationController = {};
var navigationController = {};
var pageController = {};

window.fn = {};
fn.Login = function(){
  document.getElementById('main-navigator').replacePage('main-multi-page-template');
};

// Overriding back-button function
function onDeviceReady() {
        // Register the event listener
        document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    // Do nothing - backbutton is dissabled
}