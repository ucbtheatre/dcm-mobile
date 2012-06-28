Ext.define('dcm14.store.Schedules', {
  extend: 'Ext.data.Store', 
  config : {
    model: 'dcm14.model.Schedule',
    storeId: 'Schedules',
    proxy: {
        type: 'ajax',
        url : 'dcm14data.json',
        reader: { type : 'json', rootProperty : 'Schedules', record : 'Schedule' },
        id: 'scheduleStore'
    },
    sorters: [{ property: 'endtime', direction: 'ASC' }],
    listeners:{
      load:function() {
        this.each(function(record) {
          sStore = Ext.getStore('Schedules');
          scheduleIndex = sStore.find('id', record.getId(), 0, false, false, true);
          scheduleModel = sStore.getAt(scheduleIndex);
// console.log('start time data');
            starttime_stamp = scheduleModel.data.starttime;
				    date = new Date(starttime_stamp * 1000);
				    day = date.getDay();
				    date_output = '';
				    switch (day) {
				      case 0 :
				        date_output += 'Sun ';
				        break;
				      case 6 :
				        date_output += 'Sat ' ;
				        break;
				      case 5 :
				        date_output += 'Fri ';
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
				    short_time = hours + ':' + minutes + meridian;
				    var venueStore = Ext.getStore('Venues');
				    venue = venueStore.getById(record.get('venue_id'));
				    venue_short_name = venue.data.short_name;
				    showStore = Ext.getStore('Shows');
				    showModel = showStore.getById(record.get('show_id'));
				    show_name = showModel.data.show_name;
            sStore.updateSchedule(scheduleModel, show_name, date_output, short_time, venue_short_name);
        });
      }
    }
  },
  updateSchedule:function(scheduleModel, show_name, time_display, short_time, venue_short_name) {
    scheduleModel.data.show_name = show_name;
    scheduleModel.data.time_display = time_display;
    scheduleModel.data.short_time = short_time;
    scheduleModel.data.venue_short_name = venue_short_name;
    scheduleModel.save();
  }
});