// This is a JavaScript file


// Function for filling content of elements on page request-detail-page
composeRequestDetailPage = function () {
   document.querySelector('#request-party').innerHTML = storage.transaction.name;
   document.querySelector('#request-amount').innerHTML = storage.transaction.amount;
   document.querySelector('#request-state').innerHTML = storage.transaction.state;
   document.querySelector('#cancel-button').addEventListener('click', alert.log("Prompt cancel"));
   document.querySelector('#accept-button').addEventListener('click', alert.log("Prompt accept"));
};


controlAmountInput = function() {
  var amount = document.querySelector('#input-amount').value;
  if ( $.isNumeric(amount) && amount > 0 ){
    document.querySelector('#submit-transaction-button').disabled=false;
        $('#input-amount').removeClass("incorrect-input-field");
        $('#input-amount').addClass("correct-input-field");
        systemVariables.newTransaction.amount = amount; 
    console.log("je cislo");
  }
    else{
        document.querySelector('#submit-transaction-button').disabled=true;
        console.log("neni uplne");
        $('#input-amount').removeClass("correct-input-field");
        $('#input-amount').addClass("incorrect-input-field");
    }
};



