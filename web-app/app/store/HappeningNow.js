Ext.define('dcm14.store.HappeningNow', {
  extend: 'Ext.data.Store', 
  config : {
    storeId: 'HappeningNow',
    fields:['show_id', 'show_name', 'starttime', 'endtime', 'venue_short_name', 'time_display', 'short_time'],
    groupField:'venue_short_name',
    grouper : {
      sortProperty: 'venue_id',
    }
  },
  getCurrentlyPlayingShows:function(timestamp) {
    scheduleStore = Ext.getStore('Schedules');
    happeningNowStore = Ext.getStore('HappeningNow');
    showStore = Ext.getStore('Shows');
    for (i=1; i <= 4; i++) {
	    console.log('filtering by venue ' + i);
      venue_results = happeningNowStore.filterByVenue(i);
      happeningNowStore.addToHappeningNow(venue_results);
    }
  },
  filterByVenue:function(venue_id) {
    scheduleStore = Ext.getStore('Schedules');
    scheduleStore.clearFilter();

    scheduleStore.filterBy(function(record, id){
      if (record.get('venue_id') == venue_id)
        return true;
    });
    scheduleStore.sort('starttime', 'ASC');
    return scheduleStore.getRange(0,3);
  },
  addToHappeningNow:function(results) {
	  happeningNowStore = Ext.getStore('HappeningNow');
    for (j=0; j < results.length; j++) {
      result = results[j].data;
// console.log('about to add to store');
      // console.log(result);
      happeningNowStore.add({
        show_id: result.show_id,
        show_name: result.show_name,
        starttime: result.starttime,
        short_time: result.short_time,
        endtime: result.endtime,
        time_display: result.time_display,
        venue_short_name: result.venue_short_name });
// console.log('finished adding to store');
    }
  }
});