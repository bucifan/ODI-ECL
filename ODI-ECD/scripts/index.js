// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

window.localStorage.setItem('logon', "NO");

(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    //$(window).load(function () { setTimeout(onDeviceReady, 100); });

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
       
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        //document.addEventListener( 'offline', onOffline.bind(this), false);
        //document.addEventListener( 'online', onOnline.bind(this), false);
        logon();

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
        logon();
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
        logon();
    };
    
    function onOffline() {
      // Handle the offline event
      alert("You are offline!");
    }
	
    function onOnline() {
     // Handle the online event
     alert("You are online!");
    }
})();

function logon() {
  // check to see if the network is reachable
  localStorage.setItem("logon", "attempt");
  $("#currop").html("checking internet access ...");
  checkConnection();
}

 

function checkConnection() {
   var networkState = navigator.network.connection.type;
   var states = {};
   states[Connection.UNKNOWN]  = 'Unknown connection';
   states[Connection.ETHERNET] = 'Ethernet connection';
   states[Connection.WIFI]     = 'WiFi connection';
   states[Connection.CELL_2G]  = 'Cell 2G connection';
   states[Connection.CELL_3G]  = 'Cell 3G connection';
   states[Connection.CELL_4G]  = 'Cell 4G connection';
   states[Connection.NONE]     = 'No network connection';

   //alert('Connection type: ' + states[networkState]);
   if( states[networkState] == 'No network connection'){
     $(".panel-body").html("<br/><br><b style='color:red'>" +  states[networkState] + "</b>");
   } else{
     $("#currop").html("connecting ...");
     GetItemsREST();   
     //window.location.assign("http://dev1.insurance.ohio.gov/_forms/mlogin.aspx?ReturnUrl=%2fecd%2f_layouts%2fAuthenticate.aspx%3fSource%3d%252Fecd%252Fappreturn%252Easpx&Source=%2Fecd%2Fappreturn%2Easpx");
   }  
}                 
function GetItemsREST() {
   addtrace("getItems : " + localStorage.logon);
   $.getJSON("http://dev1.insurance.ohio.gov/ecd/_vti_bin/ListData.svc/calldata",
       function (data) {
         var call_list ="";
        	$.each(data.d.results, function (key, result) {
             call_list+= "ID: "+ result.Id + " , " + result.Title + "<br/>";                              
           });
           $("#contentarea").empty();
           $("#contentarea").append(call_list);
           $("#contentarea").trigger("create");
    }).error(processRESTGetItemsError);
}
      
function processRESTGetItemsError(xhr) {
    addtrace("xhr status : " + xhr.status);
    if (xhr.status == 12150 || xhr.status == 302) {
      window.location.assign("http://dev1.insurance.ohio.gov/_forms/mlogin.aspx?ReturnUrl=http://dev1.insurance.ohio.gov/ecd/appreturn.aspx");
    }
}     

function addtrace(m){
  $("#trace").append(m + "<br/>");
}                   
