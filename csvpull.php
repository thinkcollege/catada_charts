<?php 
/*error_reporting(E_ALL);
ini_set('display_errors', 1);
$_POST  = filter_input_array(INPUT_POST, FILTER_SANITIZE_STRING);
print_r($_POST['sendString']); echo "<br /><br />";
print_r($_POST['sendTitle']); echo "<br /><br />";
print_r($_POST['sendSheetname']); */
$sendString = $_POST['sendString'];
$sendTitle = $_POST['sendTitle'];
$sendSheetname = $_POST['sendSheetname'];
$chartURL = 'https://docs.google.com/spreadsheets/d/1Zutzmq6IFxyHqOpwwjKqUeRhPt8WxY3a5TpvYdQYYf8';
$csvFilename = 'CATADA_data_'.date('m-d-Y_hi') . '.csv';
$csvReqString = '&tqx=reqId:1;out:csv';






// output headers so that the file is downloaded rather than displayed
 header('Content-Type: text/csv; charset=utf-8');
header('Content-Disposition: attachment; filename=' . $csvFilename);
$outFile = fopen('php://output', 'w'); 
for($i = 0 ; $i < count($sendString) ; $i++) {
  
  $fullURL = $chartURL . '/gviz/tq?' . $sendSheetname[$i] . 'headers=1&tq=' . $sendString[$i] . $csvReqString;
  // echo $fullURL ."<br />";
  ${'inFile_' .$i} = fopen($fullURL,'r');

// create a file pointer connected to the output stream




// $outFile = fopen('csvoutput/output4.csv','w');
$header = array($sendTitle[$i] . "\r\n");
$line =  fgetcsv( ${'inFile_' .$i});
fputcsv($outFile, $header);

while ($line !== false) {
    
    fputcsv($outFile, $line);
  $line = fgetcsv( ${'inFile_' .$i});
}


//$header = "Write some stuff at the top \r\n";


  
fclose($inFile);

}
fclose($outFile); 
$sendString = array();
$sendTitle = array();
$sendSheetname = array();

?>