// Navigation controller
// author: David Kukacka

// Navigation controller handles all logic asocieted with navigation through multiple pages, adding eventListeners and such events


document.addEventListener('init', function(event)
{
    console.log("Navigation handler..");
    var page = event.target;
    if (page.id === 'main-page')
    {
        console.log("N1. Initializing Main Page ");
        page.querySelector('#create-request-button').onclick = function()
            {
                document.querySelector('#pageNavigator')
                    .pushPage('view/html/create-request-page.html',
                    {
                        data:
                        {
                            title: 'Zadání requestu'
                        }
                    });
            };
        page.querySelector('#request-toolbar-button').onclick = function()
            {
                document.querySelector('#pageNavigator')
                    .pushPage('view/html/create-request-page.html',
                    {
                        data:
                        {
                            title: 'Zadání requestu'
                        }
                    });
            }; 
        
        page.querySelector('#payment-button').addEventListener('click', showPayments);
        page.querySelector('#request-button').addEventListener('click', showRequests);
        page.querySelector('#user-detail-button').onclick = function() {
            document.querySelector('#pageNavigator')
                    .pushPage('view/html/user-detail-page.html',
                    {
                        data:
                        {
                            title: 'Zadání requestu'
                        }
                    });

        };
        showPayments();
    }
    else if (page.id === 'create-request-page')
    {
        console.log("N2. Initializing Create-request-page ");
        page.querySelector('#define-transaction-button')
            .onclick = function()
            {
                document.querySelector('#pageNavigator')
                    .pushPage('view/html/define-transaction-page.html',
                    {
                        data:
                        {
                            title: 'Detail requestu'
                        }
                    });
            };
    }
    else if (page.id === 'success-submit-page')
    {
        console.log("N3. Initializing submit-success-page ");
        page.querySelector('#transaction-success-button')
            .onclick = function()
            {
                document.querySelector('#pageNavigator')
                    .pushPage('view/html/main-page.html',
                    {
                        data:
                        {
                            title: 'Detail requestu'
                        }
                    });
            };
    }
    else if (page.id === 'define-transaction-page')
    {
        console.log("N4. Initializing define-transaction-page ");
        page.querySelector('#submit-transaction-button')
            .onclick = function()
            {
                document.querySelector('#pageNavigator')
                    .pushPage('view/html/success-submit-page.html',
                    {
                        data:
                        {
                            title: 'Transakce zadána'
                        }
                    });
            };
    }
    else if (page.id === 'user-detail-page') {
        console.log("N5. Initializing user-detail-page");
        showUserData();
    }
});


successfullTransaction = function () {
    document.querySelector('#pageNavigator')
                    .pushPage('view/html/success-submit-page.html',
                    {
                        data:
                        {
                            title: 'Transakce úspěšně zadána'
                        }
                    });
};

showTransactionDetail = function(transactionIndex, transactionType) {
    console.log(transactionIndex + " " + transactionType);
    document.querySelector('#pageNavigator')
                    .pushPage('view/html/transaction-detail-page.html',
                    {
                        data:
                        {
                            transactionIndex: transactionIndex,
                            transactionType: transactionType
                        }
                    });
};
