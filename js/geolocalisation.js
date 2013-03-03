function close_window() {
  if (confirm("Do you want to close Geonotes ?")) {
	window.opener='X'; 
	window.open('','_parent',''); 
	window.close();
  }
}	


var previousPosition = null;
var lat = null;
var long = null;

function initialize() {

	map = new google.maps.Map(document.getElementById("map_canvas"), {
          zoom: 19,
          center: new google.maps.LatLng(48.858565, 2.347198),
          mapTypeId: google.maps.MapTypeId.HYBRID
        });   
}

function loadScript() {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = "http://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&sensor=true&callback=initialize";
  document.body.appendChild(script);
}


function Geo_location() {
		
		

		if (navigator.geolocation)
			var watchId = navigator.geolocation.watchPosition(successCallback, null, {enableHighAccuracy:true});
		else
			alert("Votre navigateur ne prend pas en compte la géolocalisation HTML5");
       
		function successCallback(position){
		lat=position.coords.latitude;
		long=position.coords.longitude;
		map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		var marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
        map: map
		});  
		if (previousPosition){
			var newLineCoordinates = [
			new google.maps.LatLng(previousPosition.coords.latitude, previousPosition.coords.longitude),
			new google.maps.LatLng(position.coords.latitude, position.coords.longitude)];
         
			var newLine = new google.maps.Polyline({
			path: newLineCoordinates,        
			strokeColor: "#FF0000",
			strokeOpacity: 1.0,
			strokeWeight: 2
			});
        newLine.setMap(map);
		}
		previousPosition = position;
    } 
}






function AfficherCarte(alt,lng,who){
    var latlng = new google.maps.LatLng(alt, lng);
        
        // Ansi que des options pour la carte, centrée sur latlng
        var optionsGmaps = {
            center:latlng,
            navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 15
        };
        if (who==1)var map = new google.maps.Map(document.getElementById("Userposition"), optionsGmaps);
        else if (who==2)var map = new google.maps.Map(document.getElementById("FriendPosition"), optionsGmaps);

        // Ajout d'un marqueur à la position trouvée
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title:"Vous êtes ici"
        });
        map.panTo(latlng);    
}
function cord(lngbis, altbis){	
		userlng= lngbis;
		useralt= altbis;
}
/*
var userlng;
var useralt;

function CalculerItineraireAmi(friendalt,friendlng)
{
    if(navigator.geolocation) {       
        function affichePosition(position) 
        {
            userlng=position.coords.longitude;
            useralt=position.coords.latitude;
            
        }

        // Fonction de callback en cas d’erreur    
        function erreurPosition(error) { }
        navigator.geolocation.getCurrentPosition(affichePosition,erreurPosition);
    }
    alert("je marche");
    
    var directionsDisplay;
    var directionsService = new google.maps.DirectionsService();
    var maCarte;
    // function initialisation() {
    directionsDisplay = new google.maps.DirectionsRenderer();
    var maPosition = new google.maps.LatLng(useralt,userlng);
    var taPosition = new google.maps.LatLng(friendalt,' ',friendlng);
    
    console.log('itineraire de ',useralt,' ',userlng,' à ',friendalt,' ',friendlng,' ');
    
    var optionsCarte = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: maPosition
    }
    maCarte = new google.maps.Map(document.getElementById("FrienItinerary"), optionsCarte);
    directionsDisplay.setMap(maCarte);
    //directionsDisplay.setPanel(document.getElementById("EmplacementItineraireTexte"));
    var requeteItineraire = {
        origin: maPosition,
        destination: taPosition,
        travelMode: google.maps.DirectionsTravelMode.WALKING
        
    };
    
    directionsService.route(requeteItineraire, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
        }
    });
    alert("jaiafficherla carte");
    //}
    //google.maps.event.addDomListener(window, 'load', initialisation);
    
}
*/