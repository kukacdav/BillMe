



function showUserData() {
    //storage.getUserDetail();
    //console.log("Username: " + storage.userContact.fullName);
    document.querySelector('#username-line').innerHTML = storage.userContact.fullName;
    document.querySelector('#phone-number-line').innerHTML = storage.userContact.phoneNumber;
    document.querySelector('#email-line').innerHTML = storage.userContact.emailAddress;
    document.querySelector('#facebook-contact-line').innerHTML = storage.userContact.facebookUsername;
}