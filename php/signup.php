<?php
include "../dbconfig/database.php";

session_unset();
session_destroy();

date_default_timezone_set('America/New_York');

$conn = new mysqli($my_server, $my_username,
				$my_password, $my_dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
		header("Location: ../pages/signup.html");
}

$first = $_POST["signup-first"];
$last = $_POST["signup-last"];
$email = $_POST["signup-email"];
$pass = $_POST["signup-pass"];

if ($conn->query("SELECT * FROM User WHERE email = '" . $email . "'")->num_rows > 0 || strcmp($first, NULL) == 0 || strcmp($last, NULL) == 0 || strcmp($email, NULL) == 0 || strcmp($pwd, NULL) == 0) {
	header("Location: ../pages/signup.html");
}

$conn->query("INSERT INTO User (first, last, email, password) values ('"
				. $conn->real_escape_string($first) . "', '"
				. $conn->real_escape_string($last) . "', '"
				. $conn->real_escape_string($email) . "', '"
				. $conn->real_escape_string($pwd) . "')");

$uid = $conn->insert_id;
echo "{$uid}";

session_start();
$_SESSION['userid'] = $uid;
header("Location: ../pages/profile.html");


if(!isset($_SESSION['userid'])) {
	header("Location: ../pages/signup.html");
}

?>
