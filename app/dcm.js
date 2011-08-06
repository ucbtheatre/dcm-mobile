var DCM = {
  db : null,
  state : {}
};

DCM.getActiveState = function( type ) {
  return parseInt( DCM.state[ type ], 10 ) || null;
}

DCM.invalidStateAction = function (){
	window.location.href= "#home"
}

DCM.dbImport = function(tableName, tableColumns, tableRows) {
	console.log('dbImport');
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

DCM.createEndTimes = function() {
	DCM.db.transaction(function(tx){
		//Add End times to shows to make it easier for Now/Next
	    tx.executeSql('ALTER TABLE dcm13_schedules ADD endtime INT;');
	    for(var venue_id = 1; venue_id < 6; venue_id++){
		sql = 'select schedules.id as schedule_id, shows.show_name, schedules.venue_id, schedules.show_id, schedules.starttime from dcm13_schedules schedules INNER JOIN dcm13_shows shows ON schedules.show_id = shows.id where schedules.venue_id = ' + venue_id + ' order by schedules.starttime asc';
			tx.executeSql(sql,
							[],
							function(tx, result){
								for(var i = 0; i < result.rows.length; i++){
									var endtime = 1313366460;
									next_item_index = i + 1;
									if(next_item_index < result.rows.length){
										next_item = result.rows.item(next_item_index);
										endtime = next_item.starttime-1;	
									}
									tx.executeSql('UPDATE dcm13_schedules set endtime = ' + endtime + ' where id = ' + result.rows.item(i).schedule_id);
							    }
							});
		}
	});
};

DCM.resetDB = function() {
	$.getJSON("dcm13data.js", function(json) {
	  DCM.db.transaction(function(txt){
	    tx.executeSql('DROP DATABASE IF EXISTS dcm');	
	  });
	  for (var i = 0; i < json.tables.length; i++) {
	    var table = json.tables[i];
	    DCM.dbImport(table.name, table.columns, table.rows);
	  }
	});
    $(".message").html("Database is Reset");
};

DCM.loadNowAndNext = function(){
	
	//Current timestamp
	var current_timestamp = Math.round(new Date().getTime() / 1000);
	// var current_timestamp = 1313221500;
	
	var current_time = new Date();
	var hours = current_time.getHours();
	var minutes = current_time.getMinutes();
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
	
	var day = 'Friday';
	switch(current_time.getDay()){
		case 6:
		day = 'Saturday';
		break;
		
		case 0:
		day = 'Sunday';
		break;
		
		case 4:
		day = 'Thursday';
		break;
		
		case 3:
		day = 'Wednesday';
		break;
		
		case 2:
		day = 'Tuesday';
		break;
		
		case 1:
		day = 'Monday';
		break;
	}
	
	$('.now-time').text(day + ' ' + (current_time.getMonth()+1) + '/' + current_time.getDate() + '/' + current_time.getFullYear() + ' ' + hours + ':' + minutes + ' ' + abbreviation);
	
	DCM.db.transaction(function(tx) {
		for(var venue_id = 1; venue_id < 6; venue_id++) {
			sql = 'select schedules.id as schedule_id, shows.show_name, schedules.venue_id, schedules.show_id, schedules.starttime, schedules.endtime from dcm13_schedules schedules INNER JOIN dcm13_shows shows ON schedules.show_id = shows.id where schedules.venue_id = ' + venue_id + ' order by schedules.starttime asc';
			tx.executeSql(sql,
							[],
							function(tx, result){
								//Container
								var container_name = '#ucbtnow';
								switch(result.rows.item(0).venue_id){
									case 2:
									container_name = "#hudsonnow";
									break;

									case 3:
									container_name = "#urbannow";
									break;

									case 4:
									container_name = "#katenow";
									break;

									case 5:
									container_name = "#haftnow";
									break;
								}
								
								//If the marathon hasn't started yet
								if(current_timestamp < 1313181000){
									$itemTpl = $(container_name).children( 'li.now-show-link-item' ).remove();
									now_item_row = result.rows.item(0),
									$now_item = $itemTpl.clone(),
						              $link = $now_item.find( 'a' );
									  $link.jqmData( 'dcm', { id : now_item_row.show_id, type : 'show' } );
									  $link.text('NEXT: ' + now_item_row.show_name);
									  $(container_name).append( $now_item );
									
									if(result.rows.length > 1){
										$nextItemTpl = $(container_name).children( 'li.next-show-link-item' ).remove();
										next_item_row = result.rows.item(1),
										$next_item = $nextItemTpl.clone(),
							              $link = $next_item.find( 'a' );
										  $link.jqmData( 'dcm', { id : next_item_row.show_id, type : 'show' } );
										  $link.text('NEXT: ' + next_item_row.show_name);
										  $(container_name).append( $next_item );
									}
									
								}
								else{
									//If the marathon is currently underway
									for(var i=0; i < result.rows.length; i++){
										if(current_timestamp >= result.rows.item(i).starttime && current_timestamp < result.rows.item(i).endtime){
											$itemTpl = $(container_name).children( 'li.now-show-link-item' ).remove();
											now_item_row = result.rows.item(i),
											$now_item = $itemTpl.clone(),
								              $link = $now_item.find( 'a' );
											  $link.jqmData( 'dcm', { id : now_item_row.show_id, type : 'show' } );
											  $link.text('NOW: ' + now_item_row.show_name);
											  $(container_name).append( $now_item );
											  
											  if(result.rows.length > 1 && i < (result.rows.length -1)) {
												$nextItemTpl = $(container_name).children( 'li.next-show-link-item' ).remove();
												next_item_row = result.rows.item(i+1),
												$next_item = $nextItemTpl.clone(),
									              $link = $next_item.find( 'a' );
												  $link.jqmData( 'dcm', { id : next_item_row.show_id, type : 'show' } );
												  $link.text('NEXT: ' + next_item_row.show_name);
												  $(container_name).append( $next_item );
											}else{
												$(container_name).children('li.next-show-link-item').remove();
											}
										}else{
											//When the marathon has started but the shows at the other theatres haven't
											//A SUPER HACK BUT IT WORKS DAMMIT - JRW
											if(current_timestamp < 1313188200 && container_name == "#hudsonnow"){
												$itemTpl = $(container_name).children( 'li.now-show-link-item' ).remove();
												now_item_row = result.rows.item(0),
												$now_item = $itemTpl.clone(),
									              $link = $now_item.find( 'a' );
												  $link.jqmData( 'dcm', { id : now_item_row.show_id, type : 'show' } );
												  $link.text('NEXT: ' + now_item_row.show_name);
												  $(container_name).append( $now_item );

												  if(result.rows.length > 1 && i < result.rows.length) {
													$nextItemTpl = $(container_name).children( 'li.next-show-link-item' ).remove();
													next_item_row = result.rows.item(1),
													$next_item = $nextItemTpl.clone(),
										              $link = $next_item.find( 'a' );
													  $link.jqmData( 'dcm', { id : next_item_row.show_id, type : 'show' } );
													  $link.text('NEXT: ' + next_item_row.show_name);
													  $(container_name).append( $next_item );
												}
											}
											if(current_timestamp > 1313362940){
												$('#hudsonnow').remove();
											}
											
											if(current_timestamp < 1313189100 && container_name == "#urbannow") {
												$itemTpl = $(container_name).children( 'li.now-show-link-item' ).remove();
												now_item_row = result.rows.item(0),
												$now_item = $itemTpl.clone(),
									              $link = $now_item.find( 'a' );
												  $link.jqmData( 'dcm', { id : now_item_row.show_id, type : 'show' } );
												  $link.text('NEXT: ' + now_item_row.show_name);
												  $(container_name).append( $now_item );

												  if(result.rows.length > 1 && i < result.rows.length) {
													$nextItemTpl = $(container_name).children( 'li.next-show-link-item' ).remove();
													next_item_row = result.rows.item(1),
													$next_item = $nextItemTpl.clone(),
										              $link = $next_item.find( 'a' );
													  $link.jqmData( 'dcm', { id : next_item_row.show_id, type : 'show' } );
													  $link.text('NEXT: ' + next_item_row.show_name);
													  $(container_name).append( $next_item );
												}
											}
											if(current_timestamp > 1313363700){
												$('#urbannow').remove();
											}
											
											if(current_timestamp < 1313190000 && container_name == '#katenow'){
												$itemTpl = $(container_name).children( 'li.now-show-link-item' ).remove();
												now_item_row = result.rows.item(0),
												$now_item = $itemTpl.clone(),
									              $link = $now_item.find( 'a' );
												  $link.jqmData( 'dcm', { id : now_item_row.show_id, type : 'show' } );
												  $link.text('NEXT: ' + now_item_row.show_name);
												  $(container_name).append( $now_item );

												  if(result.rows.length > 1 && i < result.rows.length) {
													$nextItemTpl = $(container_name).children( 'li.next-show-link-item' ).remove();
													next_item_row = result.rows.item(1),
													$next_item = $nextItemTpl.clone(),
										              $link = $next_item.find( 'a' );
													  $link.jqmData( 'dcm', { id : next_item_row.show_id, type : 'show' } );
													  $link.text('NEXT: ' + next_item_row.show_name);
													  $(container_name).append( $next_item );
												}
											}
											if(current_timestamp > 1313292700){
												$('#katenow').remove();
											}
											
											if(current_timestamp < 1313366400 && container_name == '#haftnow'){
												$itemTpl = $(container_name).children( 'li.now-show-link-item' ).remove();
												now_item_row = result.rows.item(0),
												$now_item = $itemTpl.clone(),
									              $link = $now_item.find( 'a' );
												  $link.jqmData( 'dcm', { id : now_item_row.show_id, type : 'show' } );
												  $link.text('NEXT: ' + now_item_row.show_name);
												  $(container_name).append( $now_item );
											}
										}
									}
								}
							});
		}
	});
};

DCM.loadShows = function() {

  DCM.db.readTransaction(function(tx) {
    tx.executeSql(
      'SELECT DISTINCT dcm13_schedules.show_id as id, dcm13_shows.show_name AS title FROM dcm13_schedules JOIN dcm13_shows ON (dcm13_schedules.show_id = dcm13_shows.id) ORDER BY show_name',
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

          // Add show data to link.
          $link.jqmData( 'dcm', { id : row.id, type : 'show' } );

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
      'SELECT dcm13_bookmarks.id as bookmark_id, dcm13_shows.id, dcm13_shows.show_name AS show_name, dcm13_schedules.starttime as starttime FROM dcm13_bookmarks LEFT JOIN dcm13_schedules ON (dcm13_schedules.id = dcm13_bookmarks.schedule_id) JOIN dcm13_shows ON (dcm13_schedules.show_id = dcm13_shows.id) JOIN dcm13_venues ON (dcm13_schedules.venue_id = dcm13_venues.id) ORDER BY starttime',
      [],
      function (tx, result) {

        var $items = $('#bookmarks [data-role="content"] .list'),
			$itemTpl = $items.children('.item:first'),
			$dividerTpl = $items.children('.divider:first');

        // Remove all current list items, in case.
        $items.empty();

		if(result.rows.length == 0){
			$('#bookmarks [data-role="content"]').addClass('empty_content');
			$('#bookmarks [data-role="content"]').removeClass('ui-body-a');
								
			$('#bookmarks').removeClass('ui-body-a');
			$('#bookmarks').addClass('ui-body-b');
			$('#bookmarks').addClass('empty_content');
			$('.empty_view').css('display', 'block');
			
			var template = $itemTpl.clone();
			var divider = $dividerTpl.clone();
			template.css('display','none');
			divider.css('display','none');
			$items.append(template);
			$items.append(divider);
		}
		else
		{
			$('#bookmarks [data-role="content"]').removeClass('empty_content');
			$('#bookmarks [data-role="content"]').addClass('ui-body-a');
								
			$('#bookmarks').addClass('ui-body-a');
			$('#bookmarks').removeClass('ui-body-b');
			$('#bookmarks').removeClass('empty_content');			
			
			$itemTpl.css('display', 'inherit');
			$dividerTpl.css('display', 'inherit');
			$('.empty_view').css('display', 'none');
		}
	
		var current_day = '';
		
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
			
			var weekday=new Array(7);
			weekday[0]="Sunday";
			weekday[1]="Monday";
			weekday[2]="Tuesday";
			weekday[3]="Wednesday";
			weekday[4]="Thursday";
			weekday[5]="Friday";
			weekday[6]="Saturday";
			
			if(weekday[start_time.getDay()] != current_day){
				current_day = weekday[start_time.getDay()];
				var day_header = $dividerTpl.clone();
				day_header.text(current_day); 
				$items.append(day_header);
			}
			
			if(row.show_name == "THEATRE CLEANING"){
			    $link.addClass("theatre-cleaning");
			  }
			var formattedTime = hours + ':' + minutes + ' ' + abbreviation;
			// Add show title to link
			$link.text( formattedTime + ' ' + row.show_name );
			// Add venue id to href
			$link.jqmData( 'dcm', { id : row.id, type : 'show' } );
			// Add item to list.
			$items.append( $item );
			
		}
		
		$items.listview( 'refresh' );

      }
    );

  });

};

DCM.loadPageShow = function() {

  var id = DCM.getActiveState( 'show' ),
      $itemTpl = $( '#show [data-role="content"]' );

  if(id == null){
	DCM.invalidStateAction();
  }

  DCM.db.readTransaction(function(tx) {

    tx.executeSql(
      'SELECT dcm13_shows.id, dcm13_shows.show_name, dcm13_shows.image, dcm13_shows.promo_blurb, dcm13_shows.cast_list, dcm13_venues.name as venue_name, dcm13_schedules.starttime, dcm13_bookmarks.id as bookmark_id, dcm13_schedules.id as schedule_id FROM dcm13_shows JOIN dcm13_schedules ON (dcm13_schedules.show_id = dcm13_shows.id) JOIN dcm13_venues ON (dcm13_schedules.venue_id = dcm13_venues.id) LEFT JOIN dcm13_bookmarks ON (dcm13_bookmarks.schedule_id = dcm13_schedules.id)  WHERE dcm13_shows.id = ' + id + ' LIMIT 1',
      [],
      function (tx, result) {

        var data = result.rows.item(0),
            $header = $( '#show [data-role="header"] h1' ),
            $favorite_link = $('#show [data-role="header"] #favorite_button');

        // console.log( data );

        if ( data.show_name && $header.length ) {
          // Update browser title.
          $( 'head title' ).text( data.show_name );

          $favorite_link.unbind('favorite_changed', DCM.updateFavoriteButtonUI);
          $favorite_link.bind('favorite_changed', DCM.updateFavoriteButtonUI);
          $favorite_link.addClass('favorite_listener');
          DCM.updateFavoriteButtonUI(null, {schedule_id:data.schedule_id, isFavorite: (data.bookmark_id != null)});      
        }
        
		//Show image
        if(data['image'].length && data['image'].match('^.+\.((jpg)|(gif)|(jpeg)|(png))$')){
			if($('.show-image-container').length) {
				$('.show-image-container .show-image').attr('src', data['image']);
			}
			else {
				$('.show-data-show_name').after('<div class="show-image-container"><img class="show-image" src="' + data['image'] + '" /></div>');
			}
		} else {
			if($('.show-image-container').length){
				$('.show-image-container').remove();
			}
		}
		
		//setup tweet link
		var show_link = $(location)[0].protocol + '//' + $(location)[0].host + $(location)[0].pathname + '?id=' + data.id + '#twitter_link';
		var tweet_share_url = 'http://twitter.com/share/?url=' + encodeURIComponent(show_link) + '&text=' + encodeURIComponent('#dcm13 ' + data.show_name);
		$('.tweet_link').attr('href', tweet_share_url);

		
        $.each( data, function( i, v ) {
			// console.log(i + '||' + v);
          var className = 'show-data-' + i,
              $el = $itemTpl.find( '.' + className );

          // If an HTML element exists, load it with show data.
          if ( $el.length ) {
            $el.text( v );
          }

		 if($el.hasClass('show-data-cast_list')){
			$el.html('<span class="cast-label">Cast:</span> ' + v);
		 }
		//Get all start times
		tx.executeSql('select id, show_id, venue_id, starttime from dcm13_schedules where show_id = ' + data.id + ' order by starttime asc',
					[],
					function(tx, time_result){
						// console.log(time_result);
						$showtimesList = $('#show-details-times');
						$showtimesList.children('li').remove();
						for(var time_index = 0; time_index < time_result.rows.length; time_index++) {
							time_occurance_object = time_result.rows.item(time_index);
							var start_time = new Date(time_occurance_object.starttime * 1000);

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

							var day = 'Friday';
							switch(start_time.getDay()){
								case 6:
								day = 'Saturday';
								break;

								case 0:
								day = 'Sunday';
								break;
							}
							
							var venue = 'UCB Theatre';
							switch(time_occurance_object.venue_id) {
								case 2:
								venue = 'Hudson Guild Theatre';
								break;
								
								case 3:
								venue = 'Urban Stages';
								break;
								
								case 4:
								venue = 'FIT Kate Murphy Amphitheater';
								break;
								
								case 5:
								venue = 'FIT Haft Auditorium';
								break;
							}

							var formattedTime = venue + ' ' + day + ' ' + hours + ':' + minutes + ' ' + abbreviation;
							$showtimesList.append('<li>' + formattedTime + '</li>');
							// $('.show-starttime').text(formattedTime);
						}
					});
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

          // Add venue data to link.
          $link.jqmData( 'dcm', { id : row.id, type : 'venue' } );

          // Add item to list.
          $items.append( $item );

        }

        $items.listview( 'refresh' );

      }
    );

  });

};

DCM.loadPageVenueDetails = function() {

  var id = DCM.getActiveState( 'venue' ),
      $itemTpl = $( '#venue [data-role="content"]' );

  if(id == null){
	DCM.invalidStateAction();
  }  

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
          if ( i == 'address' ){
            $el.attr( 'href', data['gmaps']);
          }

		  if ( i == 'image' ){
			$el.attr('src', data['image']);
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

          // Add venue data to link.
          $link.jqmData( 'dcm', { id : row.id, type : 'venue' } );

          // Add item to list.
          $items.append( $item );

        }

        $items.listview( 'refresh' );

      }
    );

  });

};


DCM.loadPageScheduleForVenue = function() {
	var id = DCM.getActiveState( 'venue' );
	
	if(id == null){
		DCM.invalidStateAction();
  	}	
	
	DCM.db.readTransaction(function(tx) {
		tx.executeSql(
			'SELECT name FROM dcm13_venues WHERE id = ' + id,
			[],
			function (tx, result) {
				var venue_name = result.rows.item(0).name;
	            $( '#schedule [data-role="header"] h1' ).text( venue_name );
				$( 'head title' ).text( venue_name );
			}
		);
	
		tx.executeSql(
			'SELECT shows.id, shows.show_name, schedules.starttime FROM dcm13_shows AS shows INNER JOIN dcm13_schedules AS schedules ON shows.id = schedules.show_id WHERE schedules.venue_id = ' + id + ' ORDER BY schedules.starttime ASC',
			[],
			function (tx, result) {
				var $items = $('#schedule [data-role="content"] .list'),
					$itemTpl = $items.children('.item:first'),
					$dividerTpl = $items.children('.divider:first');
				
				// Remove anything currently in the list.
				$items.empty();
				
				var current_day = '';
				
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
					
					var weekday=new Array(7);
					weekday[0]="Sunday";
					weekday[1]="Monday";
					weekday[2]="Tuesday";
					weekday[3]="Wednesday";
					weekday[4]="Thursday";
					weekday[5]="Friday";
					weekday[6]="Saturday";
					
					if(weekday[start_time.getDay()] != current_day){
						current_day = weekday[start_time.getDay()];
						var day_header = $dividerTpl.clone();
						day_header.text(current_day); 
						$items.append(day_header);
					}
					
					if(row.show_name == "THEATRE CLEANING"){
					    $link.addClass("theatre-cleaning");
					    $link.parent().next().remove();
					  }
					var formattedTime = hours + ':' + minutes + ' ' + abbreviation;
					// Add show title to link
					$link.text( formattedTime + ' ' + row.show_name );
					// Add venue id to href
					$link.jqmData( 'dcm', { id : row.id, type : 'show' } );
					// Add item to list.
					$items.append( $item );
					
				}
				
				$items.listview( 'refresh' );
				
				//Make theatre cleaning unclickable
				$('.theatre-cleaning').removeAttr('href');
			}
		);
	});
};

DCM.loadTwitterTrend = function(){
	$.ajax({
	        url: "http://search.twitter.com/search.json?q=dcm13",
	        dataType: 'jsonp',
	        success: function(json_results){
	            // Need to add UL on AJAX call or formatting of userlist is not displayed
				$('#twitList').empty();
	            $('#twitList').append('<ul data-role="listview"></ul>');
	            listItems = $('#twitList').find('ul');
	            $.each(json_results.results, function(key) {
	            	var tweet = json_results.results[key];

					var tweet_url = 'http://twitter.com/' + tweet.from_user + '/status/' + tweet.id_str;
					var user_url = 'http://twitter.com/' + tweet.from_user;
					

	            	var user_html = '<a class="tweet_user" target="_blank" href="' + user_url + '">' + tweet.from_user + '</a> ';
	            	var time_html = '<a class="tweet_time" target="_blank" href="' + tweet_url + '">' + prettyDate(new Date(tweet.created_at)) + '</a>';

	            	var img_html = '<img src="'+tweet.profile_image_url+'"/>';
	            	var content_html = '<p class="tweet_content">'+ DCM.parseUsername(DCM.parseURL(tweet.text)) +'</p>';

	            	listItems.append(
	            		'<li>' + 
	            		img_html + 
	            		'<p>' + user_html + ' ' + time_html + '</p>' +
	            		content_html +
	            		'</li>'
	            	);
	            });
	            // Need to refresh list after AJAX call
	            $('#twitList ul').listview();
	        }
	    });
};
//JRW - FOR INTERACTIVE GOOGLE MAP WEB APP, NOT NATIVE APP
// DCM.loadGoogleMap = function(){
// 	$.getScript('http://maps.google.com/maps/api/js?sensor=true', function(data, textStatus){
// 		$.getScript('http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.9/jquery-ui.min.js', function(data, textStatus){
// 			
// 			console.log(google);
// 			var latlng = new google.maps.LatLng(59.3426606750, 18.0736160278);
// 		});
// 	});
// 
// };

$( document ).bind( 'mobileinit', function() {
	//Enable Ajax
	$.mobile.ajaxEnabled  = true;
	
    // On page load, check if there's a query string (for individual item pages).
    $( 'div' ).live( 'pageshow', function( event, ui ) {
	
		if($(location)[0].hash == '#twitter_link')
		{
			var show_id = $(location)[0].search.split('=')[1];
			DCM.state[ 'show' ] = show_id;
			$.mobile.changePage('#show');
		}
	
        var $page = $.mobile.activePage;

        switch ( $page.attr( 'id' ) ) {
	
            case 'show':
                DCM.loadPageShow();
                break;

            case 'venue':
                DCM.loadPageVenueDetails();
                break;

            case 'schedule':
                DCM.loadPageScheduleForVenue();
                break;
            case 'nowandnext':
				DCM.loadNowAndNext();
				break;
				
			case 'dcm_twitter':
				DCM.loadTwitterTrend();
				break;
			// case 'interactive_map':
			// 				DCM.loadGoogleMap();
			// 				break;
        }
    });
});


//loads the data from the DB into the UI
DCM.loadData = function() {
    DCM.loadShows();
    DCM.loadVenuesForVenueDetails();
    DCM.loadVenuesForSchedules();
};

// Setup state tracking.
DCM.setupStateTracking = function() {

  $('[data-role="page"] a').live('click', function(event) {

    var $link = $( this ),
        data = $link.jqmData( 'dcm' );

    if ( data && data.id && data.type ) {
      DCM.state[ data.type ] = data.id;
    }

  });

};

$(document).ready(function($) {
  // Setup state tracking.
  DCM.setupStateTracking();

  // Load database.
  DCM.db = openDatabase('dcm', '1.0', 'Del Close Marathon', 2*1024*1024, function(db){
    //populate the DB
    $.getJSON('dcm13data.js', function(json) {
	console.log('importing the db');
      for (var i = 0; i < json.tables.length; i++) {
        var table = json.tables[i];
        DCM.dbImport(table.name, table.columns, table.rows);
      }

      //load the data into the UI
      DCM.loadData();
    });
  });

  DCM.createEndTimes();

  $('h1').ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
    $(this).text('Error!');
    console.log(thrownError);
  });
  
  if(DCM.db.version == "1.0"){
    DCM.loadData();
  }
    
  $('#bookmarks').bind('pageshow', function() {
            DCM.loadFavorites();
    });

 });


DCM.addFavoriteShow = function(event){
	DCM.db.transaction(function(tx) {
		tx.executeSql('select * from dcm13_bookmarks where schedule_id = ?',[event.data.schedule_id], function(tx, result){
			//if for some reason the show is already in the DB, do not allow it to be added again.
			if(result.rows.length > 0){
				return;
			}
			else{
				DCM.db.transaction(function(tx2) {
			    tx2.executeSql(
			            'insert into dcm13_bookmarks(schedule_id) values(?)',
			            [event.data.schedule_id],
			            function (tx2, result2) {
							$('.favorite_listener').trigger('favorite_changed', {'schedule_id': event.data.schedule_id, isFavorite:true});
			            }
			        );
				});
			}
    	});
	});
};

DCM.removeFavoriteShow = function(event){
    DCM.db.transaction(function(tx) {
    tx.executeSql(
            'delete from dcm13_bookmarks where schedule_id = ?',
            [event.data.schedule_id],
            function (tx, result) {
				$('.favorite_listener').trigger('favorite_changed', {'schedule_id': event.data.schedule_id, isFavorite:false});
            }
        );
    });
};

DCM.updateFavoriteButtonUI = function(e, data){
	$('#show [data-role="header"] #favorite_button').unbind('click');
    if(data.isFavorite)
    {
        $('#show [data-role="header"] #favorite_button').unbind('click', DCM.addFavoriteShow);
        $('#show [data-role="header"] #favorite_button').bind('click', {'schedule_id': data.schedule_id}, DCM.removeFavoriteShow);
        $('#show [data-role="header"] #favorite_button').attr('data-theme', 'b');
        $('#show [data-role="header"] #favorite_button').removeClass("ui-btn-up-a").addClass("ui-btn-up-b").removeClass("ui-btn-down-a").addClass("ui-btn-down-b").removeClass('ui-btn-hover-a');
        $('#show [data-role="header"] #favorite_button span .ui-btn-text').text('Un-favorite');
    }
    else
    {
        $('#show [data-role="header"] #favorite_button').unbind('click', DCM.removeFavoriteShow);
		$('#show [data-role="header"] #favorite_button').bind('click', {'schedule_id': data.schedule_id}, DCM.addFavoriteShow);
		$('#show [data-role="header"] #favorite_button').attr('data-theme', 'a');
		$('#show [data-role="header"] #favorite_button').removeClass("ui-btn-up-b").addClass("ui-btn-up-a").removeClass("ui-btn-down-b").addClass("ui-btn-down-a").removeClass('ui-btn-hover-b');
        $('#show [data-role="header"] #favorite_button span .ui-btn-text').text('Favorite');
    }
};


/*
 * JavaScript Pretty Date
 * Copyright (c) 2008 John Resig (jquery.com)
 * Licensed under the MIT license.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(date){
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);

	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return;

	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}

// Some text parsing for tweets provided from http://www.simonwhatley.co.uk/examples/twitter/prototype/
DCM.parseURL = function(string) {
	return string.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&~\?\/.=]+/g, function(url) {
		return "<a target='_blank' href='" + url + "'>" + url + "</a>";
	});
};

DCM.parseUsername = function(str) {
	return str.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
		var username = u.replace("@","")
		return "<a target='_blank' href='" + "http://twitter.com/" + username + "'>" + u + "</a>";
	});
};
