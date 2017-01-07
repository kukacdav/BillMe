// This is a JavaScript file
//New navigation content
document.addEventListener('init', function(event)
{
    console.log("Navigation handler..");
    var page = event.target;
    if (page.id === 'mainPage')
    {
        page.querySelector('#create-request-button')
            .onclick = function()
            {
                document.querySelector('#pageNavigator')
                    .pushPage('./html/createRequestPage.html',
                    {
                        data:
                        {
                            title: 'Page 2'
                        }
                    });
            };
    }
    else if (page.id === 'create-request-page')
    {
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
        page.querySelector('#transaction-submitted-button')
            .onclick = function()
            {
                document.querySelector('#pageNavigator')
                    .pushPage('./index.html',
                    {
                        data:
                        {
                            title: 'Page 2'
                        }
                    });
            };
    }
});