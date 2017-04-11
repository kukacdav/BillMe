// This is a JavaScript file
var currentFilter = "incomingPayments";

activateOutgoingPayments = function () {
    removeActiveClass();
    $("#outgoing-payments-filter").addClass("select-box-item-active");
    currentFilter = "outgoingPayments";
    };
activateIncomingPayments = function () {
    removeActiveClass();
    $("#incoming-payments-filter").addClass("select-box-item-active");
    currentFilter = "incomingPayments";
    };
activateUnresolvedTransactions = function () {
    removeActiveClass();
    $("#unresolved-transactions-filter").addClass("select-box-item-active");
    currentFilter = "unresolvedTransactions";
    };
    
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