<?php

define (DB_DSN, 'mysql:dbname=dcm;host=127.0.0.1');
define (DB_USER, 'root');
define (DB_PASS, 'root');

function echo_json_for_table($db, $table)
{
	echo "\t\t{\n";
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
			printf("\t\t\t\"name\": \"%s\",\n", $table);
			printf("\t\t\t\"columns\": ['%s'],\n", join("','", $column_names));
			printf("\t\t\t\"rows\": [%s]\n", join(',', $all_rows));
		}
	} else {
		echo "/* can't export $table */\n";
	}
	echo "\t\t},\n";
}

function echo_json_for_bookmarks()
{
	
	echo "\t\t{\n";
	printf("\t\t\t\"name\": \"%s\",\n", 'dcm13_bookmarks');
	printf("\t\t\t\"columns\": [\"id INTEGER PRIMARY KEY AUTOINCREMENT\", \"schedule_id INTEGER UNIQUE ON CONFLICT IGNORE\"],\n");
	printf("\t\t\t\"rows\": []\n");
	echo "\t\t}\n";
}

try {
	$db = new PDO(DB_DSN, DB_USER, DB_PASS);
	echo "{\n";
	echo "\t\"tables\": [\n";
	echo_json_for_table($db, 'dcm13_venues');
	echo_json_for_table($db, 'dcm13_schedules');
	echo_json_for_table($db, 'dcm13_shows');
	echo_json_for_table($db, 'dcm13_times');
	echo_json_for_table($db, 'dcm13_home_theatres');
	echo_json_for_bookmarks();
	echo "\t]\n";
	echo "}\n";
} catch (PDOException $e) {
	echo "Connection failed: " . $e->getMessage();
	exit(1);
}
