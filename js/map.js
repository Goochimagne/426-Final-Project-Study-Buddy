var gapi = "https://maps.googleapis.com/maps/api/js?key="INSERT KEY HERE"&callback=initMap";
var map;
var markers = [];
var userName = ''

$(function() {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', gapi);

	// $.ajax('../php/map.php',
	// 				{type: 'POST',
	// 					dataType: 'json',
	// 					data: 'marker=true',
	// 					success: function(response, states, jqXHR) {
	// 				    handleMarkers(response);
	// 				  },
	// 					error: function(response, states, jqXHR) {
	// 						alert("failure")
	// 				  }
	// 				}
	// 			);

  var post = new XMLHttpRequest();
  post.open('POST', '../php/map.php', true);
  post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
    zoom: 17,
  });

  // ------ Style -------- //
  var centerControlDiv = document.createElement('div');
  centerControlDiv.setAttribute("id", "ccd");
  centerControlDiv.setAttribute("class", "btn-toolbar");
  centerControlDiv.setAttribute("style", "vertical-align:middle;");
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
      showInfoWindow(this);
    });
    markers.push(pin);
  });
}

function classDropdown(div) {
  var my_response;
  var dropdown = document.createElement('select');
  dropdown.setAttribute("id", "dropdown");
  dropdown.setAttribute("name", "course");
  dropdown.setAttribute("style", "font-size:25px;border-radius:8px;height:35px;width:70px;color:#0386c6;");

  var post = new XMLHttpRequest();
  post.open('POST', '../php/map.php', true);
  post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var params = 'course=true';
  post.send(params);
  post.onload = function() {
    my_response = JSON.parse(post.response);
    jQuery.each(JSON.parse(post.response), function(key, val) {
      var option = document.createElement('option');
      option.setAttribute("style", "font-size:16px;text-align:center;color:#0386c6;")
      option.innerHTML = val;
      option.setAttribute("id", val);
      dropdown.appendChild(option);
    });
  }


  var drop = document.createElement('button');
  drop.setAttribute("id", "drop");
  drop.setAttribute("class", "btn btn-primary ui-btn");
  drop.setAttribute("style", "vertical-align:middle");
  drop.innerHTML = "<span class='glyphicon glyphicon-map-marker'></span>";
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
						userName = val
            var marker = new google.maps.Marker({
              map: map,
              position: e.latLng,
              animation: google.maps.Animation.DROP,
              myInfo: val + " " + course_num,
            });
            marker.addListener('click', function(e) {
              showInfoWindow(this);
            });
            markers.push(marker);
          });
        }
        post.send(params);
      });
  });

  var search = document.createElement('button');
  search.setAttribute("id", "search");
  search.setAttribute("class", "btn btn-primary ui-btn");
  search.innerHTML = "<span class='glyphicon glyphicon-search'></span>";
  search.addEventListener('click', function(event) {
    var course_num = $('#dropdown option:selected').text();
    for (i = markers.length - 1; i >= 0; i--) {
      var marker_num = markers[i].myInfo.split(" ")[2];
      if (marker_num == course_num) {
        markers[i].setMap(map)
        markers[i].setAnimation(google.maps.Animation.DROP)
      } else {
        markers[i].setMap(null);
      }
    }
  });

  var show = document.createElement('button');
  show.setAttribute("id", "show");
  show.setAttribute("class", "btn btn-primary ui-btn");
  show.innerHTML = "<span class='glyphicon glyphicon-eye-open'></span>";
  show.addEventListener('click', function(event) {
    var course_num = $('#dropdown option:selected').text();
    jQuery.each(markers, function(i, marker) {
      marker.setMap(map);
      marker.setAnimation(google.maps.Animation.DROP)
    })
  });

  var remove = document.createElement('button');
  remove.setAttribute("id", "remove");
  remove.setAttribute("class", "btn btn-primary ui-btn");
  remove.innerHTML = "<span class='glyphicon glyphicon-remove'></span>";
  remove.addEventListener('click', function(event) {
    var course_num = $('#dropdown option:selected').text();
    for (i = markers.length - 1; i >= 0; i--) {
      var marker_num = markers[i].myInfo.split(" ")[2];
			var marker_name = markers[i].myInfo.split(" ")[0] + " " + markers[i].myInfo.split(" ")[1];
      if (marker_num == course_num && userName == marker_name) {
        markers[i].setMap(null);
        markers.splice(i, 1);
        var post = new XMLHttpRequest();
        post.open("POST", '../php/map.php', true);
        post.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var params = "delete=" + course_num;
        post.send(params);
      } else {
        markers[i].setMap(map);
        markers[i].setAnimation(google.maps.Animation.DROP)
      }
    }
  });


  div.appendChild(dropdown);
  div.appendChild(drop);
	div.appendChild(remove);
  div.appendChild(search);
  div.appendChild(show);

}

function showInfoWindow(marker) {
  var info = '<div id="content">' +
    "Name: " + marker.myInfo.split(" ")[0] + " " + marker.myInfo.split(" ")[1] + "<br> Working On: " + marker.myInfo.split(" ")[2] +
    '</div>';
  var infoWin = new google.maps.InfoWindow({
    content: info
  });
  infoWin.open(map, marker);
}
