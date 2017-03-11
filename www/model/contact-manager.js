/*------------------------CORDOVA TEST----------------------------------*/

function getName(c) {
    var name = c.displayName;
    if(!name || name === "") {
        if(c.name.formatted) return c.name.formatted;
        if(c.name.givenName && c.name.familyName) return c.name.givenName +" "+c.name.familyName;
        if(c.name.givenName) return c.name.givenName;
        if(c.name.familyName) return c.name.familyName;
        return "Nameless";
    }
    return name;
}

function onSuccess(contacts) {
    //alert('Found ' + contacts.length + ' contacts.');
    console.log("Cordova: Getting phone contact list");
    for (var i = 0; i < contacts.length; i++) {
        var item={};
        
        var name = getName(contacts[i]);
        console.log("Name " + name);
        item.name = name;
        var contact = contacts[i];
        if (contact.phoneNumbers == null) {
            console.log (name + " has no number!");
            continue;
        }
        else{
            var phoneNumber = transform(contact.phoneNumbers[0].value);
            if (phoneNumber =="NaP")
                continue;
            item.phoneNumber = phoneNumber;
            console.log("-1. Name " + name + ", " + item.phoneNumber);
        }
        storage.cordovaContacts.push(item);
      }    
    storage.cordovaIndicator = true;
};

function onError(contactError) {
    alert('onError!');
};

// Function to transfrom phone number to standartized format
function transform(phone){
    console.log("Transforming: " + phone + " " + typeof phone);
    if (phone.lenght == 9){
		alert(phone);
		return phone;
	}
		phone = phone.replace(/-/g, '');
		phone = phone.replace(/ /g,'');
	if (phone.charAt(0) === '+')
	    phone = phone.slice(4, phone.length);
    if (phone.length != 9){
        console.log("Unknown phone format: " + phone);
        return "NaP";
    }
    else
        return phone;
}


function tryFinding(){
    // find all contacts with 'Bob' in any name field
    console.log("Cordova: Searching for contacts");
   navigator.contacts.find(
        [navigator.contacts.fieldType.displayName],
        onSuccess,
        onError);

};


contactManager.initialize = function(){
    console.log("CORDOVA STUFF>>>>>>>>>>>>>>");
    this.blockBackButtonFunction();
    tryFinding();
};

// Disabling back button
contactManager.blockBackButtonFunction = function(){
    document.addEventListener("backbutton", onBackKeyDown, false);
    console.log("Cordova: Blocking back button");
};


function onBackKeyDown() {
    // Do nothing - backbutton is therefore disabled
};  
