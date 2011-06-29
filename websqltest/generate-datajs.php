<?php

define (DB_DSN, 'mysql:dbname=dcm;host=127.0.0.1');
define (DB_USER, 'root');
define (DB_PASS, 'root');

function echo_json_for_table($db, $table)
{
	$st = $db->prepare("SELECT * FROM $table");
	if ($st->execute()) {
		$all_rows = array();
		if ($row = $st->fetch(PDO::FETCH_ASSOC)) {
			$column_names = array_keys($row);
			do {
				$column_values = array();
				foreach ($column_names as $key) {
					$value = $row[$key];
					if (is_numeric($value)) {
						$column_values[] = $value;
					} elseif (is_null($value)) {
						$column_values[] = 'null';
					} else {
						$column_values[] = '"' . addcslashes($value, "\"\r\n") . '"';
					}
				}
				$all_rows[] = "[" . join(',', $column_values) . "]";
			} while ($row = $st->fetch(PDO::FETCH_ASSOC));
			echo "dbimport(DB, '$table', ['", join("','", $column_names), "'], [", join(',', $all_rows), "]);\n";
		}
	} else {
		echo "/* can't export $table */\n";
	}
}

try {
	$db = new PDO(DB_DSN, DB_USER, DB_PASS);
	echo 'loadCallback(function (DB) {';
	echo_json_for_table($db, 'dcm13_venues');
	echo_json_for_table($db, 'dcm13_schedules');
	echo_json_for_table($db, 'dcm13_shows');
	echo '});';
} catch (PDOException $e) {
	echo "Connection failed: " . $e->getMessage();
	exit(1);
}
