<?php
include "./dbconfig/database.php";

$conn = new mysqli($my_server, $my_username,
				$my_password, $my_dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
		header("Location: ../pages/login.html");
}
// Dropping a marker
$userid = 136;
$lat = 35.911646069992585;
$lng = -79.05130863189697;
$num = 410;
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

print_r($username);
exit();

?>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
	</head>
	<body>
	</body>
</html>
