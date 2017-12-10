$(function(){

	var get_info = new XMLHttpRequest();
	  get_info.open('POST', '../php/profile.php', true);
		get_info.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		var params = 'info=true';
		get_info.send(params);
	  get_info.onload = function() {
	      handleInfo(JSON.parse(get_info.response));
	  }

	var get_courses = new XMLHttpRequest();
	  get_courses.open('POST', '../php/profile.php', true);
		get_courses.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		params = 'courses=true';
		get_courses.send(params);
	  get_courses.onload = function() {
	      handleCourses(JSON.parse(get_courses.response));
	  }

	var get_enrolled = new XMLHttpRequest();
	  get_enrolled.open('POST', '../php/profile.php', true);
		get_enrolled.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		params = 'enrolled=true';
		get_enrolled.send(params);
	  get_enrolled.onload = function() {
	      handleEnrolled(JSON.parse(get_enrolled.response));
	  }



});

$("#add-button").click( function(e){
	$("#add-class").css("display", "block");
});

function handleInfo(json){
	jQuery.each(json, function(i, data) {
		switch(i){
			case 0:
			$("#info-div").append("<div id='first'>First:" + data + " </div>");
			break;
			case 1:
			$("#info-div").append("<div id='last'>Last:" + data + " </div>");
			break;
			case 2:
			$("#info-div").append("<div id='email'>Email:" + data + " </div>");
			break;
		}
	});
}
function handleCourses(json){
	jQuery.each(json, function(i, data) {
		var course = $("<option>" + data + "</option>")
		$("#course-dropdown").append(course);
  });
}
function handleEnrolled(json){
	jQuery.each(json, function(i, data) {
		// <span class="glyphicon glyphicon-remove"></span>
		// <span class="glyphicon glyphicon-remove-sign"></span>
		// <span class="glyphicon glyphicon-plus-sign"></span>
		var close_button = $("<div class='x' onclick='removeClass(event)'>&times</div>");
		var course_div = $("<div class='course' id='" + data + "'>" + data + "</div>");
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
		course_div.css("color", "#ffffff");
		// course_div.css({
		// 	""
		// })
		course_div.append(close_button);
		$("#classes").append(course_div);
  });
}
