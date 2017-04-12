// Contact Manager
// This class works with Cordova-contact-plugin. Class handles data retrieval from device as well as their parsing.
// Created by: David Kukacka
// Functions for getting name of the contact
var contactManager = {};

// Method for initializing application in regards of Cordova
// - method blocks back button function
// - method retrievs contact list
contactManager.initialize = function()
{
    this.blockBackButtonFunction();
    this.getContactList();
};

// Method foŕ disabling back button
contactManager.blockBackButtonFunction = function()
{
    document.addEventListener("backbutton", onBackKeyDown, false);

    function onBackKeyDown(e)
    {
        return false;
    }
};

function onBackKeyDown()
{
    // Do nothing - backbutton is therefore disabled
};

// Method for retrieving contact-list of device
// - when contact list is succesfully gotten, method calls this.onSuccess
// - when contact list is not succesfully gotten, method calls this.onError
contactManager.getContactList = function()
{
    console.log("Cordova: Searching for contacts");
    navigator.contacts.find(
        [navigator.contacts.fieldType.displayName], contactManager.onSuccess, contactManager.onError);
};

// Method for getting name of contact - due to platform differences
contactManager.getName = function(c)
{
    var name = c.displayName;
    if (!name || name === "")
    {
        if (c.name.formatted) return c.name.formatted;
        if (c.name.givenName && c.name.familyName) return c.name.givenName + " " + c.name.familyName;
        if (c.name.givenName) return c.name.givenName;
        if (c.name.familyName) return c.name.familyName;
        return "Nameless";
    }
    return name;
};

// Method for handeling success during loading device contacts
contactManager.onSuccess = function (contacts)
{
    console.log("Cordova: Phone contacts loaded successfully");
    storage.cordovaContacts = [];
    for (var i = 0; i < contacts.length; i++)
    {
        var item = {};
        var name = contactManager.getName(contacts[i]);
        item.name = name;
        item.valid = false;
        var contact = contacts[i];
        if (contact.phoneNumbers == null)
        {
            continue;
        }
        else
        {
            var phoneNumber = contactManager.transform(contact.phoneNumbers[0].value);
            if (phoneNumber == "NaP") continue;
            item.phoneNumber = phoneNumber;
        }
        storage.cordovaContacts.push(item);
    }
    storage.cordovaIndicator = true;
    console.log("Cordova: DONE, contact list built");
    loginController.initializeApplication();
    //storage.getApplicationData();
};

// Method for handeling error during loading device contacts 
contactManager.onError = function(contactError)
{
    alert('Cordova: Error loading device contacts!');
};

// Function to transfrom phone number to standartized format
contactManager.transform = function(phone)
{
    if (phone.lenght == 9)
    {
        alert(phone);
        return phone;
    }
    if (phone.charAt(0) === '+') phone = phone.slice(4, phone.length);
    phone = phone.replace(/-/g, '');
    phone = phone.replace(/ /g, '');
    if (phone.length != 9)
    {
        return "NaP";
    }
    else return phone;
};



// Function for creating new contact in device memory
contactManager.submitNewContact = function(name, phone)
{
    var myContact = navigator.contacts.create(
    {
        "displayName": name,
        "phoneNumbers": [
        {
            "type": "mobile",
            "value": phone
        } ],
    });
     myContact.save();
};