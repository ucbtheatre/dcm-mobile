var DCM = { db : null };

DCM.dbImport = function(tableName, tableColumns, tableRows) {
  DCM.db.transaction(function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS ' + tableName);
    tx.executeSql('CREATE TABLE ' + tableName + ' (' + tableColumns.join(',') + ')');
    var q = [];
    for (var i = 0; i < tableColumns.length; i++) {
      q.push('?');
    }
    var query = 'INSERT INTO ' + tableName + ' VALUES (' + q.join(',') + ')';
    for (var i = 0; i < tableRows.length; i++) {
      tx.executeSql(query, tableRows[i]);
    }
  });
};

DCM.loadShows = function() {
  DCM.db.readTransaction(function(tx) {
    tx.executeSql(
      'SELECT dcm13_shows.show_name AS title FROM dcm13_schedules JOIN dcm13_shows ON (dcm13_schedules.show_id = dcm13_shows.id) JOIN dcm13_venues ON (dcm13_schedules.venue_id = dcm13_venues.id) ORDER BY starttime',
      [],
      function (tx, result) {

        var $shows = $('#list-shows');

        // Remove all current list items.
        $shows.empty();

        for (var i = 0; i < result.rows.length; i++) {

          var row = result.rows.item( i ),
              $link = $( '<a href="show.html" data-transition="slide" />' ),
              $item = $( '<li />' ).append( $link );

          // Add show title to link.
          $link.text( row.title );

          // Add item to list.
          $shows.append( $item );

        }

        $shows.listview( 'refresh' );

      }
    );
  });
};

$(document).ready(function($) {

  // Load database.
  DCM.db = openDatabase('dcm', '1.0', 'Del Close Marathon', 2*1024*1024);

  $('h1').ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
    $(this).text('Error!');
    console.log(thrownError);
  });

  // test if data is already loaded; if so, skip the next part and just call loadShows()
  $.getJSON('dcm13data.js', function(json) {

    for (var i = 0; i < json.tables.length; i++) {
      var table = json.tables[i];
      DCM.dbImport(table.name, table.columns, table.rows);
    }

    DCM.loadShows();

  });

});
