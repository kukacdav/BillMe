/*------------------------CORDOVA TEST----------------------------------*/

// Functions for getting name of the contact
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

// Function for handeling success during loading device contacts
function onSuccess(contacts) {
    console.log("Cordova: Phone contacts loaded successfully");
    storage.cordovaContacts = [];
    for (var i = 0; i < contacts.length; i++) {
        var item={};
        var name = getName(contacts[i]);
        item.name = name;
        item.valid = false;
        var contact = contacts[i];
        if (contact.phoneNumbers == null) {
            continue;
        }
        else{
            var phoneNumber = transform(contact.phoneNumbers[0].value);
            if (phoneNumber =="NaP")
                continue;
            item.phoneNumber = phoneNumber;
        }
        storage.cordovaContacts.push(item);
      }    
    storage.cordovaIndicator = true;
    console.log("Cordova: DONE, contact list built");
    storage.getApplicationData();
};

// Function for handeling error during loading device contacts 
function onError(contactError) {
    alert('Cordova: Error loading device contacts!');
};

// Function to transfrom phone number to standartized format
function transform(phone){
    // console.log("Transforming: " + phone + " " + typeof phone + " " + phone.length );
    if (phone.lenght == 9){
		alert(phone);
		return phone;
	}
    if (phone.charAt(0) === '+')
        phone = phone.slice(4, phone.length);
    phone = phone.replace(/-/g, '');
	phone = phone.replace(/ /g,'');
    if (phone.length != 9){
        //alert("Unknown format: " + phone);
        // console.log("Unknown phone format: " + phone + " " + phone.length);
        return "NaP";
    }
    else
        return phone;
}


contactManager.getContactList = function(){
    // find all contacts with 'Bob' in any name field
    console.log("Cordova: Searching for contacts");
   navigator.contacts.find(
        [navigator.contacts.fieldType.displayName],
        onSuccess,
        onError);

};

// Method for initializing device on Cordova level
contactManager.initialize = function(){
    this.blockBackButtonFunction();
    this.getContactList();
};

// Method foŕ disabling back button
contactManager.blockBackButtonFunction = function(){
    
    document.addEventListener("backbutton", onBackKeyDown, false);
    function onBackKeyDown(e) {
    return false;
    }
    /*
    document.addEventListener("backbutton", onBackKeyDown, false);
    console.log("Cordova: Blocking back button");*/
};


function onBackKeyDown() {
    // Do nothing - backbutton is therefore disabled
};  
