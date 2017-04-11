// Script.js
// This class defines used variables
// Created by: David Kukacka

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
