Ext.define('dcm14.view.schedule.List', {
  
  extend: 'Ext.List',
  xtype: 'schedules',
  prepareData:function(data, record_index, record) {
    // console.log(data);
    // console.log(record);
    starttime_stamp = data.starttime;
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
    var schedule = Ext.create('dcm14.model.Schedule', data);
    var venueStore = Ext.getStore('Venues');
    venue = venueStore.getById(data.venue_id);
    venue_short_name = venue.data.short_name;
    return { starttime : data['starttime'], show_id : data['show_id'], starttime_string : date_output, venue_name : venue_short_name };
  },
  config: {
    title: 'Showtimes',
    itemTpl: [
      '<div class="schedule-start-time">{starttime_string}</div><div class="schedule-venue-name" style="float:right;margin-top:-20px;">{venue_name}</div><div>'
    ]
  },
  initialize: function() {
    this.config.title = dcm14.app.title;
    this.callParent();
// console.log('initialized');
    this.addListener('show', function(){console.log('show');});
    // this.prepareData();
  }
});