var DEBUG = 0;
var DEBUG_TIME = new Date("August 13, 2011 11:13:00");

var DCM = { db : null };

DCM.getTime = function(){
	return DEBUG ? DEBUG_TIME : new Date();
};

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

DCM.createBookmarkTable = function(){
	// DCM.db.transaction(function(tx) {
	// 		tx.executeSql('SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = "dcm13_bookmarks"',
	// 		[],
	// 		  function(tx, result) {
	// 			if(result.rows.length == 0){
	// 				tx.executeSql('CREATE TABLE dcm13_bookmarks (bookmark_id int, show_id int, starttime timestamp)')
	// 			}
	// 		  }
	// 		);
	// 	});
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

DCM.loadFavorites = function() {

  DCM.db.readTransaction(function(tx) {
    tx.executeSql(
      'SELECT dcm13_bookmarks.id as bookmark_id, dcm13_shows.id, dcm13_shows.show_name AS title FROM dcm13_bookmarks LEFT JOIN dcm13_schedules ON (dcm13_schedules.show_id = dcm13_bookmarks.show_id) JOIN dcm13_shows ON (dcm13_schedules.show_id = dcm13_shows.id) JOIN dcm13_venues ON (dcm13_schedules.venue_id = dcm13_venues.id) ORDER BY show_name',
      [],
      function (tx, result) {

        var $items = $('#bookmarks [data-role="content"] .list'),
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



DCM.loadPageShow = function( params ) {

  var id = parseInt( params.id, 10 ),
      $itemTpl = $( '#show [data-role="content"]' );

  DCM.db.readTransaction(function(tx) {

    tx.executeSql(
      'SELECT dcm13_shows.*, dcm13_venues.*, dcm13_bookmarks.id as bookmark_id FROM dcm13_shows LEFT JOIN dcm13_bookmarks ON (dcm13_bookmarks.show_id = dcm13_shows.id) JOIN dcm13_schedules ON (dcm13_schedules.show_id = dcm13_shows.id) JOIN dcm13_venues ON (dcm13_schedules.venue_id = dcm13_venues.id) WHERE dcm13_shows.id = ? LIMIT 1',
      [id],
      function (tx, result) {

        var data = result.rows.item(0),
            $header = $( '#show [data-role="header"] h1' ),
			$favorite_link = $('#show [data-role="header"] #favorite_button');

        // console.log( data );

        if ( data.show_name && $header.length ) {

          // Update app title.
          $header.text( data.show_name );

          // Update browser title.
          $( 'head title' ).text( data.show_name );

		  $favorite_link.attr('onclick', 'DCM.favorite(' + data.id + ')');
		  if(data.bookmark_id != null)
		  {
		    $favorite_link.attr('data-theme','b')
		    $favorite_link.addClass('ui-btn-up-b')
		    $favorite_link.addClass('ui-btn-down-b')
		    $('#favorite_button span .ui-btn-text').text('Remove from Favorites');
		  }
		  else
		  {
		    $favorite_link.attr('data-theme','a')
		    $favorite_link.addClass('ui-btn-up-a')
		    $favorite_link.addClass('ui-btn-down-a')
		    $('#favorite_button span .ui-btn-text').text('Add to Favorites');
		  }

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

DCM.loadVenuesForVenueDetails = function() {

  DCM.db.readTransaction(function(tx) {

    tx.executeSql(
      'SELECT id, name FROM dcm13_venues ORDER BY id',
      [],
      function (tx, result) {

        var $items = $('#venues_details [data-role="content"] .list'),
            $itemTpl = $items.children( 'li:first' ).remove();

        // Remove all current list items, in case.
        //$items.empty();

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

DCM.loadPageVenueDetails = function( params ) {

  var id = parseInt( params.id, 10 ),
      $itemTpl = $( '#venue [data-role="content"]' );

  DCM.db.readTransaction(function(tx) {

    tx.executeSql(
      'SELECT dcm13_venues.* FROM dcm13_venues WHERE dcm13_venues.id = ? LIMIT 1',
      [id],
      function (tx, result) {

        var data = result.rows.item(0),
            $header = $( '#venue [data-role="header"] h1' );

        // console.log( data );

        if ( data.name && $header.length ) {

          // Update app title.
          // $header.text( data.name );

          // Update browser title.
          $( 'head title' ).text( data.name );

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


DCM.loadVenuesForSchedules = function() {

  DCM.db.readTransaction(function(tx) {

    tx.executeSql(
      'SELECT id, name, short_name FROM dcm13_venues ORDER BY id',
      [],
      function (tx, result) {

        var $items = $('#venues_schedules [data-role="content"] .list'),
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


DCM.loadPageScheduleForVenue = function( params ) {

	var id = parseInt( params.id, 10 );
	
	DCM.db.readTransaction(function(tx) {
		tx.executeSql(
			'SELECT name FROM dcm13_venues WHERE id = ?',
			[id],
			function (tx, result) {
				var venue_name = result.rows.item(0).name;
	            $( '#schedule [data-role="header"] h1' ).text( venue_name );
				$( 'head title' ).text( venue_name );
			}
		);
	
		tx.executeSql(
			'SELECT shows.id, shows.show_name, schedules.starttime FROM dcm13_shows AS shows INNER JOIN dcm13_schedules AS schedules ON shows.id = schedules.show_id WHERE schedules.venue_id = ? ORDER BY schedules.starttime ASC',
			[id],
			function (tx, result) {
				var $items = $('#schedule [data-role="content"] .list'),
					$itemTpl = $items.children( 'li:first' ).remove();
				
				// Remove anything currently in the list.
				$items.empty();
				
				for (var i = 0; i < result.rows.length; i++) {
					var row = result.rows.item( i ),
						$item = $itemTpl.clone(),
						$link = $item.find( 'a' ),
						href = $link.attr( 'href' );
					
					var start_time = new Date(row.starttime * 1000);
					var hours = start_time.getHours();
					var minutes = start_time.getMinutes();
					if (minutes < 10) {
						minutes = '0' + minutes;
					}
					var abbreviation = 'AM';
					if (hours > 12) {
						abbreviation = 'PM';
						hours = hours - 12;
					}
					if (hours == 0) {
						hours = 12;
					}
					var formattedTime = hours + ':' + minutes + ' ' + abbreviation;
					// Add show title to link
					$link.text( formattedTime + ' ' + row.show_name );
					// Add venue id to href
					$link.attr( 'href', href + '?id=' + row.id );
					// Add item to list.
					$items.append( $item );
				}
				
				$items.listview( 'refresh' );
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
				DCM.loadPageShow( params );
				break;

			case 'venue':
				DCM.loadPageVenueDetails( params );
				break;

			case 'schedule':
				DCM.loadPageScheduleForVenue( params );
				break;
		
		}
	});
});


//loads the data from the DB into the UI
DCM.loadData = function() {
	DCM.loadShows();
    DCM.loadVenuesForVenueDetails();
    DCM.loadVenuesForSchedules();
	DCM.loadFavorites();
};
	

$(document).ready(function($) {

  // Load database.
  DCM.db = openDatabase('dcm', '1.0', 'Del Close Marathon', 2*1024*1024, function(db){
	//populate the DB
 	$.getJSON('dcm13data.js', function(json) {
	  for (var i = 0; i < json.tables.length; i++) {
	    var table = json.tables[i];
	    DCM.dbImport(table.name, table.columns, table.rows);
	  }
	  //load the data into the UI
	  DCM.loadData();
	});
  });

  $('h1').ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
    $(this).text('Error!');
    console.log(thrownError);
  });
  
  if(DCM.db.version == "1.0"){
    DCM.loadData();
  }


	$('#bookmarks').bind('pageshow', function() {
	        console.log('show nearby');
			DCM.loadFavorites();
	    });

 });



DCM.favorite = function(show_id) {
	//update favorite button status.
	var currentTheme = $('#favorite_button').attr('data-theme')
	if(currentTheme == 'a')
	{
		$('#favorite_button').attr('data-theme', 'b');
		$('#favorite_button').removeClass("ui-btn-up-a").addClass("ui-btn-up-b").removeClass("ui-btn-down-a").addClass("ui-btn-down-b").removeClass('ui-btn-hover-a');
		$('#favorite_button span .ui-btn-text').text('Remove from Favorites');
		
		DCM.db.transaction(function(tx) {
	 	tx.executeSql(
				'insert into dcm13_bookmarks(show_id) values(?)',
				[show_id],
				function (tx, result) {
					//do nothing.
				}
			);
		});
	}
	else
	{
		DCM.db.transaction(function(tx) {
	 	tx.executeSql(
				'delete from dcm13_bookmarks where show_id = ?',
				[show_id],
				function (tx, result) {
					//do nothing.
				}
			);
		});
		
		
		$('#favorite_button').attr('data-theme', 'a');
		$('#favorite_button').removeClass("ui-btn-up-b").addClass("ui-btn-up-a").removeClass("ui-btn-down-b").addClass("ui-btn-down-a").removeClass('ui-btn-hover-b');
		$('#favorite_button span .ui-btn-text').text('Add to Favorites');
	}
};



