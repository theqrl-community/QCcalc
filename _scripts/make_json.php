<?php
$dir = "web/";
$files1 = scandir($dir);

$arr=array();
foreach ($files1 as $key => $value) {
	if (substr( $value, 0, 5 ) === "cumul") {
		$arr[$value]=explode(",",trim(file_get_contents($dir.$value)));
	}
}

// print_r($arr);
file_put_contents($dir."0.json",json_encode($arr));