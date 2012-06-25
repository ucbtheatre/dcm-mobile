Ext.define('dcm14.view.schedule.List', {
  
  extend: 'Ext.List',
  xtype: 'schedules',
  config: {
    title: 'Showtimes',
    itemTpl: [
      '<div class="schedule-start-time">{time_display}</div><div class="schedule-venue-name" style="float:right;margin-top:-20px;">{venue_short_name}</div><div>'
    ]
  },
  initialize: function() {
    this.config.title = dcm14.app.title;
    this.callParent();
  }
});