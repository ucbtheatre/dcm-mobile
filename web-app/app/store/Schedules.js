Ext.define('dcm14.store.Schedules', {
  extend: 'Ext.data.Store', 
  config : {
    model: 'dcm14.model.Schedule',
    storeId: 'Schedules',
    proxy: {
        type: 'ajax',
        url : 'dcm13data.json',
        reader: { type : 'json', rootProperty : 'Schedules', record : 'Schedule' },
        id: 'scheduleStore'
    },
    listeners:{
      load:function() {
        this.each(function(record) {
          sStore = Ext.getStore('Schedules');
          scheduleIndex = sStore.find('id', record.getId());
          scheduleModel = sStore.getAt(scheduleIndex);
            starttime_stamp = scheduleModel.data.starttime;
				    date = new Date(starttime_stamp * 1000);
				    day = date.getDay();
				    date_output = '';
				    switch (day) {
				      case 0 :
				        date_output += 'Sunday ';
				        break;
				      case 6 :
				        date_output += 'Saturday ' ;
				        break;
				      case 5 :
				        date_output += 'Friday ';
				    }
				    meridian = ' AM';
				    hours = date.getHours();
				    if (hours > 12) {
				      meridian = ' PM';
				      hours -= 12;
				    }
				    minutes = date.getMinutes();
				    if (minutes == 0) {
				      minutes = '00';
				    }
				    date_output += date.getMonth() + '/' + date.getDate() + ' ' + hours + ':' + minutes + meridian;
				    var venueStore = Ext.getStore('Venues');
				    venue = venueStore.getById(record.get('venue_id'));
				    venue_short_name = venue.data.short_name;
            sStore.updateSchedule(scheduleModel, date_output, venue_short_name);
        });
      }
    }
  },
  updateSchedule:function(scheduleModel, time_display, venue_short_name) {
    scheduleModel.data.time_display = time_display;
    scheduleModel.data.venue_short_name = venue_short_name;
    scheduleModel.save();
  }
});