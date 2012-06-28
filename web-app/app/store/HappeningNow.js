Ext.define('dcm14.store.HappeningNow', {
  extend: 'Ext.data.Store', 
  config : {
    storeId: 'HappeningNow',
    fields:['show_id', 'show_name', 'starttime', 'endtime', 'venue_short_name', 'time_display', 'short_time', 'venue_id'],
    grouper : {
      property: 'venue_short_name',
      sortProperty: 'venue_id',
      direction: 'ASC',
    },
    sorters: [{
      property: 'starttime',
      direction: 'ASC'
    }],
    listeners:{
      load:function(){
        current_time = new Date();
        this.getCurrentlyPlayingShows(current_time.getTime());
      }
    }
  },
  getCurrentlyPlayingShows:function(timestamp) {
    scheduleStore = Ext.getStore('Schedules');
    happeningNowStore = Ext.getStore('HappeningNow');
    showStore = Ext.getStore('Shows');
    happeningNowStore.removeAll();
    // TODO: remove hardcoded max value for venue_id
    for (i=1; i <= 7; i++) {
      venue_results = happeningNowStore.filterByVenue(i, timestamp);
      happeningNowStore.addToHappeningNow(venue_results);
    }
  },
  filterByVenue:function(venue_id, timestamp) {
    scheduleStore = Ext.getStore('Schedules');
    scheduleStore.clearFilter();
    scheduleStore.filterBy(function(record, id){
      if (record.data.venue_id == venue_id) {
        if ((record.data.endtime*1000) > timestamp) {
          return true;
        }
      }
    });
    scheduleStore.sort('starttime', 'ASC');
    return scheduleStore.getRange(0,3);
  },
  addToHappeningNow:function(results) {
	  happeningNowStore = Ext.getStore('HappeningNow');
    for (j=0; j < results.length; j++) {
      result = results[j].data;
      happeningNowStore.add({
        show_id: result.show_id,
        show_name: result.show_name,
        starttime: result.starttime,
        short_time: result.short_time,
        endtime: result.endtime,
        time_display: result.time_display,
        venue_short_name: result.venue_short_name,
        venue_id: result.venue_id });
    }
  }
});