<?php
header('Access-Control-Allow-Origin: *');

$directory = "../";

$scanned_directory = $scanned_directory = array_diff(scandir($directory), array('..', '.'));
$images = preg_grep('/.\.(jpeg|jpg|png)$/', $scanned_directory);

$zip = new ZipArchive();
$filename = "project" . time() . ".zip";

if ($zip->open($filename, ZipArchive::CREATE)!==TRUE) {
    exit("cannot open <$filename>\n");
}

foreach ($images as $key => $value) {
    $zip->addFile($directory . $value, $value);
}

foreach ($_GET as $key => $value) {
    $zip->addFromString(substr($key, 0, strlen($key)-4) . ".dgm", $value);
}

$zip->close();

header('Content-Type: application/zip');
header('Content-disposition: attachment; filename='.$filename);
header('Content-Length: ' . filesize($filename));
readfile($filename);

?>