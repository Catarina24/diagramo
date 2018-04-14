<?php

$directory = "../";
$scanned_directory = array_diff(scandir($directory), array('..', '.'));

$images = preg_grep('/.\.(jpeg|jpg|png)$/', $scanned_directory);

$simple_array = array();

foreach ($images as $key => $value) {
    array_push($simple_array, $value);
}


$response = array("status" => "OK", "message" => $simple_array);
echo json_encode($response);

?>