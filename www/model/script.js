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
    },
    cordovaContacts: [
    ]
};
var systemVariables = {
    newTransaction: {}
};

var communicationController = {};
var navigationController = {};
var pageController = {};
var contactManager = {};

window.fn = {};
fn.Login = function(){
  document.getElementById('main-navigator').replacePage('main-multi-page-template');
};
