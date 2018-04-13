<!doctype html>

<?php

$data = $_POST['content'];

$fname = "media/gameData.dat";
$file = fopen($fname, 'w');
fwrite($file, $data);
fclose($file);

?>
