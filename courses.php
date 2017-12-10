<?php

include "./dbconfig/database.php";

date_default_timezone_set('America/New_York');

$conn = new mysqli($my_server, $my_username,
				$my_password, $my_dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$handle = fopen("./courses.txt", "r");

$conn->query("DELETE FROM Course");

if ($handle) {
  while (($line = fgets($handle)) !== false) {
		$data = explode(" ", $line);
		$c_name = '';
		foreach(array_slice($data, 3) as &$val) {
			$c_name .= " " . $val;
		}
		$conn->query("INSERT INTO Course (depo, num,
			name) values ('"
			. $conn->real_escape_string($data[0]) . "' , '"
			. $conn->real_escape_string($data[1]) . "' , '"
			. $conn->real_escape_string($c_name) . "')");
  }
  fclose($handle);
} else {
  echo "File read error: ";
}
?>
<html>
 <body>
	 <br>
	 Stuff Happened
 </body>
</html>
