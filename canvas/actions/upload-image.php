<?php
header('Access-Control-Allow-Origin: *');

$message = "";

$target_dir = "../";
$file = $_FILES["pic"];
$target_file = $target_dir . basename($file["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
// Check if image file is a actual image or fake image
if(isset($_POST["submit"])) {
    $check = getimagesize($file["tmp_name"]);
    if($check !== false) {
        $message .= "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk .= 0;
    }
}
// Check if file already exists
if (file_exists($target_file)) {
    $message .= "Sorry, file already exists.";
    $uploadOk = 0;
}
// Check file size
if ($file["size"] > 500000) {
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