// Navigation controller
// author: David Kukacka

// Navigation controller handles all logic asocieted with navigation through multiple pages, adding eventListeners and such events


document.addEventListener('init', function(event)
{
    console.log("Navigation handler..");
    var page = event.target;
    if (page.id === 'mainPage')
    {
        console.log("N1. Initializing Main Page ");
        page.querySelector('#create-request-button').onclick = function()
            {
                document.querySelector('#pageNavigator')
                    .pushPage('./html/createRequestPage.html',
                    {
                        data:
                        {
                            title: 'Můj přehled'
                        }
                    });
            };
        page.querySelector('#payment-button').addEventListener('click', showPayments);
        page.querySelector('#request-button').addEventListener('click', showRequests);
        page.querySelector('#user-detail-button').onclick = function() {
            document.querySelector('#pageNavigator')
                    .pushPage('./html/user-detail-page.html',
                    {
                        data:
                        {
                            title: 'Můj přehled'
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
                    .pushPage('./html/defineTransactionPage.html',
                    {
                        data:
                        {
                            title: 'Page 2'
                        }
                    });
            };
    }
    else if (page.id === 'submit-success-page')
    {
        console.log("N3. Initializing submit-success-page ");
        page.querySelector('#transaction-success-button')
            .onclick = function()
            {
                document.querySelector('#pageNavigator')
                    .pushPage('./html/mainPage.html',
                    {
                        data:
                        {
                            title: 'Page 2'
                        }
                    });
            };
    }
    else if (page.id === 'user-detail-page') {
        console.log("N4. Initializing user-detail-page");
        showUserData();
    }
});