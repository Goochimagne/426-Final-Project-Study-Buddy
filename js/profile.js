$(function() {

  var get_info = new XMLHttpRequest();
  get_info.open('POST', '../php/profile.php', true);
  get_info.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  var params = 'info=true';
  get_info.send(params);
  get_info.onload = function() {
     handleInfo(JSON.parse(get_info.response));
  }




  var get_courses = new XMLHttpRequest();
  get_courses.open('POST', '../php/profile.php', true);
  get_courses.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  params = 'courses=true';
  get_courses.send(params);
  get_courses.onload = function() {
    handleCourses(JSON.parse(get_courses.response));
  }

  var get_enrolled = new XMLHttpRequest();
  get_enrolled.open('POST', '../php/profile.php', true);
  get_enrolled.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  params = 'enrolled=true';
  get_enrolled.send(params);
  get_enrolled.onload = function() {
    handleEnrolled(JSON.parse(get_enrolled.response));
  }
});


function handleInfo(json) {
  jQuery.each(json, function(i, data) {
    switch (i) {
      case 0:
        $("#info-div").append("<span style='font-weight:bold;'>First: </span>" + data);
        break;
      case 1:
        $("#info-div").append(" " + data + "<br>");
        break;
      case 2:
        $("#info-div").append("<span style='font-weight:bold;'>Email: </span>" + data + "<br> <span style='font-weight:bold'>School: </span>University of North Carolina Chapel Hill");
        break;
    }
  });
}

function handleCourses(json) {
  jQuery.each(json, function(i, data) {
    var course = $("<option>" + data + "</option>")
    $("#course-dropdown").append(course);
  });
}

function handleEnrolled(json) {
  jQuery.each(json, function(i, data) {
    var close_button = $("<div class='exit-div' onclick='removeClass(event)'><span class='glyphicon glyphicon-remove exit'></span></div>");
    var course_div = $("<div class='course' id='" + data + "'><span style=' font-size:70px; position: relative; top: -20px;'>  {</span>  " + data + "  <span style='font-size:70px; position: relative; top: -20px;'>}</span></div>");
    switch (i) {
      case 1:
        course_div.css("background-color", "#00e676");
        break;
      case 2:
        course_div.css("background-color", "#ff1744");
        break;
      case 3:
        course_div.css("background-color", "#40c4ff");
        break;
      case 4:
        course_div.css("background-color", "#ffeb3b");
        break;
      case 5:
        course_div.css("background-color", "#9c27b0");
        break;
      default:
        course_div.css("background-color", "#ff1744");
        break;
    }
    course_div.css("color", "#f6f6f6");
    course_div.append(close_button);
    $("#classes").append(course_div);
  });
}

function addClass(e) {
	var course = $("#course-dropdown option:selected").text().split(":")[0];
	var add = new XMLHttpRequest();
	add.open("POST", "../php/profile.php", true);
	add.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "add=" + course;
	add.send(params);
	add.onload = function() {
		var close_button = $("<div class='exit-div' onclick='removeClass(event)'><span class='glyphicon glyphicon-remove exit'></span></div>");
		var course_div = $("<div class='course' id='" + course + "'><span style=' font-size:70px; position: relative; top: -20px;'>  {</span>  " + course + "  <span style='font-size:70px; position: relative; top: -20px;'>}</span></div>");
		if (Math.random() < .25) {
			course_div.css("background-color", "#00e676");
		} else if (Math.random() >= .25 && Math.random() < .5) {
			course_div.css("background-color", "#ff1744");
		} else if (Math.random() >= .50 && Math.random() < .75) {
			course_div.css("background-color", "#40c4ff");
		} else if (Math.random() >= .75 && Math.random() < 1) {
			course_div.css("background-color", "#ffeb3b");
		} else {
			course_div.css("background-color", "#9c27b0");
		}
		course_div.css("color", "#f6f6f6");
		course_div.append(close_button);
		$("#classes").append(course_div);
	}
}

function removeClass(e) {
	var course = $(e.path[0]).parent().parent().attr('id');
	$(e.path[0]).parent().parent().remove();
	var xhr = new XMLHttpRequest();
	xhr.open("POST", "../php/profile.php", true);
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var params = "delete=" + course;
	xhr.send(params);
}
