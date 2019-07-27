<?php

  ini_set('display_errors', 0);
  set_time_limit(2);

  $query = strval(@$_GET['q']);
  $score = 0;

  if ($query) {
    require dirname(__FILE__) . '/../fakeometer/Fakeometer.class.php';
    $f = new Fakeometer();
    $score = $f->lookup($query);
  }

  header('Cache-Control: no-cache, must-revalidate');
  header('Expires: Fri, 01 Jan 2010 00:00:00 GMT');
  header('Content-Type: application/json');
  echo json_encode(array(
    'query'   => $query,
    'score'   => $score,
    'success' => ($score > 0)
  ));

?>
