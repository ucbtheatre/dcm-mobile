DB = null;

function dbImport(DB, tableName, tableColumns, tableRows)
{
	DB.transaction(function(tx) {
		tx.executeSql('DROP TABLE IF EXISTS ' + tableName);
		tx.executeSql('CREATE TABLE ' + tableName +
		              ' (' + tableColumns.join(',') + ')');
		var q = [];
		for (var i = 0; i < tableColumns.length; i++) {
			q.push('?');
		}
		var query = 'INSERT INTO ' + tableName + ' VALUES (' + q.join(',') + ')';
		for (var i = 0; i < tableRows.length; i++) {
			tx.executeSql(query, tableRows[i]);
		}
	});
}

function loadShows(DB)
{
	DB.readTransaction(function(tx) {
		tx.executeSql(
			'SELECT dcm13_shows.show_name AS title FROM dcm13_schedules JOIN dcm13_shows ON (dcm13_schedules.show_id = dcm13_shows.id) JOIN dcm13_venues ON (dcm13_schedules.venue_id = dcm13_venues.id) ORDER BY starttime',
			[],
			function (tx, result) {
				var shows = $('#shows');
				shows.children().remove();
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item(i);
					var li = document.createElement('LI');
					var a = document.createElement('A');
					a.innerText = row.title;
					a.href = 'show.html';
					a['data-transition'] = "slide";
					li.appendChild(a);
					shows.append(li);
				}
			}
		);
	});
}

$(document).ready(function($) {
	DB = openDatabase('dcm', '1.0', 'Del Close Marathon', 2*1024*1024);
	$('h1').ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
		$(this).text('Error!');
		console.log(thrownError);
	});
	// test if data is already loaded; if so, skip the next part and just call loadShows()
	$.getJSON('dcm13data.js', function(json) {
		for (var i = 0; i < json.tables.length; i++) {
			var table = json.tables[i];
			dbImport(DB, table.name, table.columns, table.rows);
		}
		loadShows(DB);
	});
});
