// Transaction-controller
// author: David Kukacka

// Transaction controller handle all logic asosiated with trasnactions - requests and payments

function showRequests()  {
    console.log("T1. - Showing requests");
    var requests = storage.requests;
    document.querySelector('#transaction-list').innerHTML=requests.map(function(item){
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{label}}', item.amount);
            console.log("QuerySelector");
    }).join('');
};

//FIXME: Why is this not working, when return back to page after submit request 
function showPayments() {
   console.log("T2. - Showing payments");
    var payments = storage.payments;
    document.querySelector('#transaction-list').innerHTML=payments.map(function(item){
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{label}}', item.amount);
    }).join('');
    console.log(document.querySelector('#transaction-list').innerHTML);
};


function submitTransaction() {
    console.log("T3. - Submitting transaction");
    // MUST BE INDEPENDENT ON VIEW!!
    var test = document.querySelector('#transaction-amount').innerHTML;
    console.log(test);
    $.ajax(
    {
        type: "POST",
        url: deploydEndpoint + '/request?',
        data:
        {
            "accountInitiator": "b3162c0b1611b96e",
            "accountReciever": "7a5815ef7262fa55",
            "amount": "1000",
            "message": "Penize za obed"
        },
        success: function(data)
        {
              document.querySelector('#pageNavigator')
                .pushPage('./html/submitSuccess.html',
                {
                    data:
                    {
                        title: 'Page 2'
                    }
                });
        },
        dataType: "json"
    });
};