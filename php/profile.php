<?php
include "../dbconfig/database.php";

session_start();

date_default_timezone_set('America/New_York');


$conn = new mysqli($my_server, $my_username,
				$my_password, $my_dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
		header("Location: ../pages/login.html");
}

if ($_SERVER['REQUEST_METHOD'] == "GET") {
	header('Content-Type: application/json');
	$info = array();
	$courses = array();
	$enrolled = array();

}

if ($_SERVER['REQUEST_METHOD'] == "POST") {
	header('Content-Type: application/json');
	$info = array();
	$courses = array();
	$enrolled = array();

	if ($_POST['add'] != null){

		$course = $_POST['add'];

		$cid = ($conn->query("SELECT cid from Course where num=" . $course))->fetch_row();

		$conn->query("INSERT INTO Enrolled (cid, uid) values (" . $cid[0] . ", " . $_SESSION['userid'] . ")");

		exit();

	} else if ($_POST['delete'] != null) {

		$course = $_POST['delete'];

		$cid = ($conn->query("SELECT cid from Course where num=" . $course))->fetch_row();

		$conn->query("DELETE from Enrolled where cid=" . $cid[0] . " and uid=" . $_SESSION['userid']);

		exit();
	} else if ($_POST['info'] != null) {
		$user = $conn->query("SELECT first, last, email from User
													where uid=" . $_SESSION['userid']);
			while($row = $user->fetch_row()){
				array_push($info, $row[0]);
				array_push($info, $row[1]);
				array_push($info, $row[2]);
			}
		echo json_encode($info);
		exit();
	} else if ($_POST['courses'] != null) {
		$course = $conn->query("SELECT num, name from Course");
			while($row = $course->fetch_row()){
				array_push($courses, ($row[0] . ":" . $row[1]));
			}
		echo json_encode($courses);
		exit();
	} else if ($_POST['enrolled'] != null){
		$course_query = $conn->query("SELECT cid from Enrolled where uid=" .
																		$_SESSION['userid']);
			while($row = $course_query->fetch_row()) {
				$course = $conn->query("SELECT num from Course where cid=" .
																		$row[0])->fetch_row();
					array_push($enrolled, $course[0]);
			}
		echo json_encode($enrolled);
		exit();
	}

}

?>
