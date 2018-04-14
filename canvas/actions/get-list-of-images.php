<?php

$directory = "../static/images/";
$scanned_directory = array_diff(scandir($directory), array('..', '.'));

$simple_array = array();

foreach ($scanned_directory as $key => $value) {
    array_push($simple_array, $value);
}

$response = array("status" => "OK", "message" => $simple_array);
echo json_encode($response);
?>