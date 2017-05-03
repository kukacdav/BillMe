// Select box
// This class represents logic of component select-box, used for filtering transactions based on thier type
// Created by: David Kukacka


var currentFilter = "incomingPayments";

// Method for showing outgoing payments
activateOutgoingPayments = function () {
    removeActiveClass();
    $("#outgoing-payments-filter").addClass("select-box-item-active");
    currentFilter = "outgoingPayments";
    };

// Method for showing incoming payments
activateIncomingPayments = function () {
    removeActiveClass();
    $("#incoming-payments-filter").addClass("select-box-item-active");
    currentFilter = "incomingPayments";
    };

// Method for showing unresolved transactions
activateUnresolvedTransactions = function () {
    removeActiveClass();
    $("#unresolved-transactions-filter").addClass("select-box-item-active");
    currentFilter = "unresolvedTransactions";
    };
    
// Support method for handeling CSS styles according to component state
removeActiveClass = function() {
    if ($("#incoming-payments-filter").hasClass("select-box-item-active")){
        $("#incoming-payments-filter").removeClass("select-box-item-active");
        $("#incoming-payments-filter").addClass("select-box-item");
    }
    else if($("#unresolved-transactions-filter").hasClass("select-box-item-active")){
        $("#unresolved-transactions-filter").removeClass("select-box-item-active");
        $("#unresolved-transactions-filter").addClass("select-box-item");
    }
    else if ($("#outgoing-payments-filter").hasClass("select-box-item-active") ) {
        $("#outgoing-payments-filter").removeClass("select-box-item-active");        
        $("#outgoing-payments-filter").addClass("select-box-item");    
    }
};