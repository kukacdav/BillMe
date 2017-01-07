// This is a JavaScript file

function submitTransaction () {
 $.ajax({
  type: "POST",
  url: deploydEndpoint + '/request?',
  data: {
    "accountInitiator": "b3162c0b1611b96e",
    "accountReciever": "7a5815ef7262fa55",
	"amount": "1000",
	"message": "Penize za obed"
      },
  success: function (data){
      document.querySelector('#pageNavigator').pushPage('./html/submitSuccess.html', {data: {title: 'Page 2'}});
      console.log("******************************* CHECKPOINT *******************************");
      //billMe.showRequests();
  },
  dataType: "json"
});

}
