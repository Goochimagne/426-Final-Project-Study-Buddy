<?php
include "../dbconfig/database.php";

session_unset();
session_destroy();

date_default_timezone_set('America/New_York');

$conn = new mysqli($my_server, $my_username,
				$my_password, $my_dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$email = $_POST["signup-email"];
$pass = $_POST["signup-pass"];

$user_query = $conn->query("SELECT * FROM User WHERE email = '" . $email . "' AND password = '" . $pass . "'");

if ($user_query->num_rows != 1) {
	header("Location: ../pages/login.html");
}

$uid = $user_query->fetch_row();

session_start();
$_SESSION['userid'] = $uid[0];
header("Location: ../pages/profile.html");


if(!isset($_SESSION['userid'])) {
	header("Location: ../pages/signup.html");
}

?>
