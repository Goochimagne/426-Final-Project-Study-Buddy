<?php
	include "../dbconfig/database.php";

	session_start();
	date_default_timezone_set('America/New_York');

	if(!isset($_SESSION['userid'])) {
		header("Location: ./login.php");
	}

	$conn = new mysqli($my_server, $my_username,
			$my_password, $my_dbname);

	if ($conn->connect_error) {
	  die("Connection failed: " . $conn->connect_error);
	}

	if ($_SERVER['REQUEST_METHOD'] == "GET") {
	}


	if ($_SERVER['REQUEST_METHOD'] == "POST") {
		header('Content-Type: application/json');
		$userid = $_SESSION['userid'];


		if($_POST['lat'] != null) {

			// Dropping a marker
			$lat =  $_POST['lat'];
			$lng =  $_POST['long'];
			$num = $_POST['num'];
			$username = array();

			// Insert a new Location into the location table
			$conn->query("INSERT INTO Location (latitude, longitude) values (" . $lat . ", " . $lng . ")");

			// Return associated location id
			$lid = $conn->insert_id;

			// Get course id from course num
			$cid = $conn->query("SELECT cid from Course where num=" . $num)->fetch_row();

			# Drop a new marker with the uid, lid, cid
			$conn->query("INSERT INTO Marker (uid, lid, cid, time) values (" . $userid . ", " . $lid . ",  " . $cid[0] . ", DEFAULT)");

			// Return the name of the user dropping the pin
			$row =	$conn->query("SELECT first, last from User where uid=" . $userid)->fetch_all();
				array_push($username, $row[0][0] . " " . $row[0][1]);

			echo json_encode($username);
			exit();

		} else if ($_POST['course'] != null) {

			// This works! Populating the dropdown.
			$enrolled = array();
			$course_query = $conn->query("SELECT cid from Enrolled where uid=" . $userid);

				while($row = $course_query->fetch_row()) {
					$course = $conn->query("SELECT num from Course where cid=" . $row[0])->fetch_row();

						array_push($enrolled, $course[0]);
				}
			echo json_encode($enrolled);
			exit();

		} else if ($_POST['marker'] != null) {

			$markers = array();
			// Get all the markers
			$pins = $conn->query("SELECT uid, lid, cid from Marker")->fetch_all();
			  #	Get info associated with the markers
				foreach ($pins as $key => $value) {
					$row =	$conn->query("SELECT first, last, latitude, longitude, num from
														Location as L, User as U, Course as C where U.uid=" . $value[0] . " and L.lid=" . $value[1] . " and C.cid=" . $value[2])->fetch_all();
							array_push($markers, $row[0][0]." ".$row[0][1]." ".$row[0][4]." ".$row[0][2]." ".$row[0][3]);

				}

			echo json_encode($markers);
			exit();
		} else if ($_POST['delete'] != null) {
			$cid = $conn->query("SELECT cid from Course where num=" . $_POST['delete'])->fetch_all();

			$conn->query("DELETE from Marker WHERE cid=" . $cid[0][0]);
		}
	}

?>
