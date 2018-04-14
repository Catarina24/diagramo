<?php
header('Access-Control-Allow-Origin: *');

$message = "";
$target_dir = "../static/projects/";

if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

$file = $_FILES["folder"];
$target_file = $target_dir . basename($file["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));


// Check if file already exists
if (file_exists($target_file)) {
    $message .= "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
if ($file["size"] > 5000000) {
    $message .= "Sorry, your file is too large.";
    $uploadOk = 0;
}
// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    $message .= "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} else {
    if (move_uploaded_file($file["tmp_name"], $target_file)) {
        $message .= "The file ". basename( $file["name"]). " has been uploaded.";
    } else {
        $message .= "Sorry, there was an error uploading your file.";
    }
}

$status = "";

if($uploadOk){
    $status = "OK";
}
else{
    $status = "ERROR";
}

echo json_encode(array("status" => $status, "message" => $message));

?>