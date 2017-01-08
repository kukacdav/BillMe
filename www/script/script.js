var billMe = {
    filterFlag: 'all',
    events: []
};

storage.init();

/* 
billMe.refresh = function(){
    console.log("B3. Refreshing");
    var items = storage.filter(this.filterFlag);
    this.mainPage.innerHTML = items.map(function(item){
        console.log(item);
        return document.querySelector('#transaction-list-item').innerHTML
            .replace('{{label}}', item.account);
            console.log("QuerySelector");
    }).join('');    
    //Remove all event listeners to add them again
    var children = this.mainPage.children; //.children selects all children elements
    this.events.forEach(function(event, i){
        event.element.removeEventListener('click', event.function);
    });
    this.events = [];
    var event = {};
    items.forEach (function(item, i){
        event = {
            element: children[i].querySelector('ons-icon'),
            function: this.removeItemPrompt.bind(this, item.account)
        };
        this.events.push(event);
        event.element.addEventListener('click', event.function);
    }.bind(billMe));
};*/




/* THIS CODE WILL BE NECESSARY FOR STRATEGY PATTERN
billMe.filter = function(evt){
    console.log("B4. filtering");
    this.filterFlag = evt.target.getAttribute('data-filter')||'all';
    console.log(this.filterFlag);
    this.refresh();
};*/