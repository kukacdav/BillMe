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
