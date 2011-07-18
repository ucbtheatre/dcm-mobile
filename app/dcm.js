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
      'SELECT dcm13_shows.id, dcm13_shows.show_name AS title FROM dcm13_schedules JOIN dcm13_shows ON (dcm13_schedules.show_id = dcm13_shows.id) JOIN dcm13_venues ON (dcm13_schedules.venue_id = dcm13_venues.id) ORDER BY show_name',
      [],
      function (tx, result) {

        var $items = $('#shows [data-role="content"] .list'),
            $itemTpl = $items.children( 'li:first' ).remove();

        // Remove all current list items, in case.
        $items.empty();

        for (var i = 0; i < result.rows.length; i++) {

          var row = result.rows.item( i ),
              $item = $itemTpl.clone(),
              $link = $item.find( 'a' ),
              href = $link.attr( 'href' );

          // Add show title to link.
          $link.text( row.title );

          // Add show id to href.
          $link.attr( 'href', href + '?id=' + row.id );

          // Add item to list.
          $items.append( $item );

        }

        // Reload list plugin.
        $items.listview( 'refresh' );

      }
    );

  });

};

DCM.loadShow = function( params ) {

  var id = parseInt( params.id, 10 ),
      $itemTpl = $( '#show [data-role="content"]' );

  DCM.db.readTransaction(function(tx) {

    tx.executeSql(
      'SELECT dcm13_shows.* FROM dcm13_shows JOIN dcm13_schedules ON (dcm13_schedules.show_id = dcm13_shows.id) JOIN dcm13_venues ON (dcm13_schedules.venue_id = dcm13_venues.id) WHERE dcm13_shows.id = ' + id + ' LIMIT 1',
      [],
      function (tx, result) {

        var data = result.rows.item(0),
            $header = $( '#show [data-role="header"] h1' );

        // console.log( data );

        if ( data.show_name && $header.length ) {

          // Update app title.
          $header.text( data.show_name + ' | DCM 13' );

          // Update browser title.
          $( 'head title' ).text( $header.text() );

        }

        $.each( data, function( i, v ) {

          var className = 'show-data-' + i,
              $el = $itemTpl.find( '.' + className );

          // If an HTML element exists, load it with show data.
          if ( $el.length ) {
            $el.text( v );
          }

        });

      }
    );

  });

};

DCM.loadVenues = function() {

  DCM.db.readTransaction(function(tx) {

    tx.executeSql(
      'SELECT id, name FROM dcm13_venues ORDER BY id',
      [],
      function (tx, result) {

        var $items = $('#venues [data-role="content"] .list'),
            $itemTpl = $items.children( 'li:first' ).remove();

        // Remove all current list items, in case.
        $items.empty();

        for (var i = 0; i < result.rows.length; i++) {

          var row = result.rows.item( i ),
              $item = $itemTpl.clone(),
              $link = $item.find( 'a' ),
              href = $link.attr( 'href' );

          // Add show title to link.
          $link.text( row.name );

          // Add venue id to href.
          $link.attr( 'href', href + '?id=' + row.id );

          // Add item to list.
          $items.append( $item );

        }

        $items.listview( 'refresh' );

      }
    );

  });

};

DCM.loadVenue = function( params ) {

  var id = parseInt( params.id, 10 ),
      $itemTpl = $( '#venue [data-role="content"]' );

  DCM.db.readTransaction(function(tx) {

    tx.executeSql(
      'SELECT dcm13_venues.* FROM dcm13_venues WHERE dcm13_venues.id = ' + id + ' LIMIT 1',
      [],
      function (tx, result) {

        var data = result.rows.item(0),
            $header = $( '#venue [data-role="header"] h1' );

        // console.log( data );

        if ( data.name && $header.length ) {

          // Update app title.
          $header.text( data.name + ' | DCM 13' );

          // Update browser title.
          $( 'head title' ).text( $header.text() );

        }

        $.each( data, function( i, v ) {

          var className = 'venue-data-' + i,
              $el = $itemTpl.find( '.' + className );

          // If an HTML element exists, load it with show data.
          if ( $el.length ) {
            $el.text( v );
          }

        });

      }
    );

  });

};

$( document ).bind( 'mobileinit', function() {

  // On page load, check if there's a query string (for individual item pages).
  $( 'div' ).live( 'pageshow', function( event, ui ) {

    var params = $.deparam.querystring( location.hash, true ),
        $page = $.mobile.activePage;

    switch ( $page.attr( 'id' ) ) {

      case 'show':
        DCM.loadShow( params );
        break;

      case 'venue':
        DCM.loadVenue( params );
        break;

    }

  });

});

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

    DCM.loadVenues();

  });

});
