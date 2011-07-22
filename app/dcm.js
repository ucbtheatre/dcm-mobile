var DEBUG = 0;
var DEBUG_TIME = new Date("August 13, 2011 11:13:00");

var DCM = { db : null };
/*
 * DCM.getTime
 */
DCM.getTime = function(){
	return DEBUG ? DEBUG_TIME : new Date();
};

/*
 * DCM.dbImport
 */
DCM.dbImport = function(tableName, tableColumns, tableRows) {

/*
 * DCM.loadShows
 */
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

/*
 * DCM.loadFavorites
 */
DCM.loadFavorites = function() {

/*
 * loadPageShow
 */
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

/*
 * DCM.loadVenuesForVenueDetails
 */
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

/*
 * DCM.loadPageVenueDetails
 */
DCM.loadPageVenueDetails = function( params ) {

/*
 * DCM.loadVenuesForSchedules
 */
DCM.loadVenuesForSchedules = function() {

/*
 * DCM.loadPageScheduleForVenue
 */
DCM.loadPageScheduleForVenue = function( params ) {
	
/*
 * DCM.favorite
 */
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
	
//loads the data from the DB into the UI
DCM.loadData = function() {
	DCM.loadShows();
    DCM.loadVenuesForVenueDetails();
    DCM.loadVenuesForSchedules();
	DCM.loadFavorites();
};


$( document ).bind( 'mobileinit', function() {	

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



