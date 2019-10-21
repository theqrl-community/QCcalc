<?php
$input_dir = "assets/raw/";
$output_dir = "assets/";
$files = scandir($input_dir);

$arr=array();
foreach ($files as $key => $value) {
	if (substr( $value, 0, 1 ) === "c") {
		$array_contents = explode(",",trim(file_get_contents($input_dir.$value))); 

		// Find first "1"
		$array_key = array_search(1, $array_contents);

		// Grab next key and reform
		if($array_key < 100 && $array_key != false) {
			$array_key++;
			$array_contents = array_slice($array_contents, 0, $array_key);
		}

		$arr[$value]=$array_contents;
	
		$array_key=100;
	}
}

// print_r($arr);
file_put_contents($output_dir."qccalc.json",json_encode($arr));