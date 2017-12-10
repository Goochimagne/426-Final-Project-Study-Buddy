var gapi = "https://maps.googleapis.com/maps/api/js?key=AIzaSyABgy67H76t3Ru-wOvR1YhBXKa3fmJUl_w&callback=initMap";
var map;
var markers = [];

$(function() {
  var xhr = new XMLHttpRequest();
  	xhr.open('GET', gapi);

  var post = new XMLHttpRequest();
	  post.open('POST', '../php/map.php', true);
		post.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		var params = 'marker=true';
	  post.send(params);
	  post.onload = function() {
	      handleMarkers(JSON.parse(post.response));
	  }
});


function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: -34.397,
      lng: 150.644
    },
    zoom: 15,
		// styles: [
	  //           {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
	  //           {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
	  //           {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
	  //           {
	  //             featureType: 'administrative.locality',
	  //             elementType: 'labels.text.fill',
	  //             stylers: [{color: '#d59563'}]
	  //           },
	  //           {
	  //             featureType: 'poi',
	  //             elementType: 'labels.text.fill',
	  //             stylers: [{color: '#d59563'}]
	  //           },
	  //           {
	  //             featureType: 'poi.park',
	  //             elementType: 'geometry',
	  //             stylers: [{color: '#263c3f'}]
	  //           },
	  //           {
	  //             featureType: 'poi.park',
	  //             elementType: 'labels.text.fill',
	  //             stylers: [{color: '#6b9a76'}]
	  //           },
	  //           {
	  //             featureType: 'road',
	  //             elementType: 'geometry',
	  //             stylers: [{color: '#38414e'}]
	  //           },
	  //           {
	  //             featureType: 'road',
	  //             elementType: 'geometry.stroke',
	  //             stylers: [{color: '#212a37'}]
	  //           },
	  //           {
	  //             featureType: 'road',
	  //             elementType: 'labels.text.fill',
	  //             stylers: [{color: '#9ca5b3'}]
	  //           },
	  //           {
	  //             featureType: 'road.highway',
	  //             elementType: 'geometry',
	  //             stylers: [{color: '#746855'}]
	  //           },
	  //           {
	  //             featureType: 'road.highway',
	  //             elementType: 'geometry.stroke',
	  //             stylers: [{color: '#1f2835'}]
	  //           },
	  //           {
	  //             featureType: 'road.highway',
	  //             elementType: 'labels.text.fill',
	  //             stylers: [{color: '#f3d19c'}]
	  //           },
	  //           {
	  //             featureType: 'transit',
	  //             elementType: 'geometry',
	  //             stylers: [{color: '#2f3948'}]
	  //           },
	  //           {
	  //             featureType: 'transit.station',
	  //             elementType: 'labels.text.fill',
	  //             stylers: [{color: '#d59563'}]
	  //           },
	  //           {
	  //             featureType: 'water',
	  //             elementType: 'geometry',
	  //             stylers: [{color: '#17263c'}]
	  //           },
	  //           {
	  //             featureType: 'water',
	  //             elementType: 'labels.text.fill',
	  //             stylers: [{color: '#515c6d'}]
	  //           },
	  //           {
	  //             featureType: 'water',
	  //             elementType: 'labels.text.stroke',
	  //             stylers: [{color: '#17263c'}]
	  //           }
	  //         ]
	        });

  // ------ Style -------- //
	var centerControlDiv = document.createElement('div');
	centerControlDiv.setAttribute("id", "ccd");
	centerControlDiv.setAttribute("class", "btn-toolbar");
	centerControlDiv.setAttribute("style", "background-color:black;vertical-align:middle;");
  classDropdown(centerControlDiv);
	centerControlDiv.index = 1;
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);


  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      pos = {
        lat: 35.911646069992585,
				// position.coords.latitude,
        lng: -79.05130863189697
				// position.coords.longitude
      };
      user_pos = pos;
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    // Browser doesn't support Geolocation
    locationError(false, map.getCenter());
  }
}

function locationError(browserHasGeolocation, pos) {
  alert(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
}

function handleMarkers(response) {
  jQuery.each(response, function(i, data) {
		data = data.split(" ");
    var pos = {
      lat: parseFloat(data[3]),
      lng: parseFloat(data[4])
    };
    var pin = new google.maps.Marker({
      map: map,
      position: pos,
      clickeable: true,
			myInfo: data[0] + " " + data[1] + " " + data[2],
    });
    pin.addListener('click', function(e) {
			console.log(this.myInfo);
    });
		markers.push(pin);
  });
}

function classDropdown(div) {
	var my_response;
	var dropdown = document.createElement('select');
	dropdown.setAttribute("id", "dropdown");
	dropdown.setAttribute("name", "course");
	dropdown.setAttribute("style", "font-size:30px;border-radius:8px;margin-top:10px;");

	var post = new XMLHttpRequest();
	  post.open('POST', '../php/map.php', true);
		post.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		var params = 'course=true';
	  post.send(params);
	  post.onload = function() {
			my_response = JSON.parse(post.response);
      jQuery.each(JSON.parse(post.response), function(key, val) {
				var option = document.createElement('option');
				option.setAttribute("style", "font-size:16px;text-align:center;")
				option.innerHTML = val;
				option.setAttribute("id", val);
				dropdown.appendChild(option);
			});
		}

// <span class="glyphicon glyphicon-plus"></span>
// <span class="glyphicon glyphicon-pushpin"></span>
// <span class="glyphicon glyphicon-map-marker"></span>
	var drop = document.createElement('button');
	drop.setAttribute("id", "drop");
	drop.setAttribute("class", "btn btn-primary");
	drop.setAttribute("style", "vertical-align:middle");
	drop.innerHTML= "+";
	drop.addEventListener('click', function(event) {
		var course_num = $('#dropdown option:selected').text();
		var username;
		google.maps.event.addListenerOnce(map, 'click',
			function(e) {
				var lat = e.latLng.lat();
				var lng = e.latLng.lng();
				var post = new XMLHttpRequest();
					post.open("POST", '../php/map.php', true);
					post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					var params = "lat=" + lat + "&long=" +
					lng + "&num=" + course_num;
					post.onload = function() {
						jQuery.each(JSON.parse(post.response), function(key, val) {
							var marker = new google.maps.Marker({
								map: map,
								position: e.latLng,
								myInfo: val + " " + course_num,
							});
							marker.addListener('click', function(e) {
								console.log(this.myInfo);
							});
							markers.push(marker);
						});
					}
					post.send(params);
			});
	});
// <span class="glyphicon glyphicon-search"></span>
// <span class="glyphicon glyphicon-zoom-out"></span>
	var search = document.createElement('button');
	search.setAttribute("id", "search");
	search.setAttribute("class", "btn btn-primary");
	search.innerHTML= "o";
	search.addEventListener('click', function(event) {
		var course_num = $('#dropdown option:selected').text();
		console.log(course_num);
		for (i = markers.length - 1 ; i >= 0 ; i--) {
			var marker_num = markers[i].myInfo.split(" ")[2];
			console.log(marker_num);
			if(marker_num == course_num){
				markers[i].setMap(map)
			} else {
				markers[i].setMap(null);
			}
		}
	});

	var show = document.createElement('button');
	show.setAttribute("id", "show");
	show.setAttribute("class", "btn btn-primary");
	show.innerHTML= "ALL";
	show.addEventListener('click', function(event) {
		var course_num = $('#dropdown option:selected').text();
		jQuery.each(markers, function(i, marker) {
			marker.setMap(map);
		})
	});

	var remove = document.createElement('button');
	remove.setAttribute("id", "remove");
	remove.setAttribute("class", "btn btn-primary");
	remove.innerHTML= "REMOVE";
	remove.addEventListener('click', function(event) {
		var course_num = $('#dropdown option:selected').text();
		for (i = markers.length - 1 ; i >= 0 ; i--) {
			console.log(i);
			console.log(markers[i]);
			var marker_num = markers[i].myInfo.split(" ")[2];
			if(marker_num == course_num){
				markers[i].setMap(null);
				markers.splice(i, 1);
				var post = new XMLHttpRequest();
					post.open("POST", '../php/map.php', true);
					post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					var params = "delete=" + course_num;
					post.send(params);
			} else {
				markers[i].setMap(map);
			}
		}
	});


  div.appendChild(dropdown);
	div.appendChild(drop);
	div.appendChild(search);
	div.appendChild(show);
	div.appendChild(remove);

}
