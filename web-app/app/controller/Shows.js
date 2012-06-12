Ext.define('dcm14.controller.Shows', {
  extend: 'Ext.app.Controller',
  config: {
    refs: {
      shows: 'shows',
      show: 'show',
      showInfo: 'showContainer showInfo',
      showPerformers: 'showContainer list',
      showContainer: 'showContainer', 
      showSchedules: 'showContainer list'
    },
    control: {
      shows: {
        initialize: 'initShows',
        itemtap: 'onShowTap'
      }
    }
  },

  initShows: function() {
    // console.log('Hello Shows!');
  },

  onShowTap: function(list, idex, el, record) {
    var scheduleStore = Ext.getStore('Schedules');
    var showId = record.get('id');
    
    scheduleStore.clearFilter();
    scheduleStore.filterBy(function(schedule) {
      console.log(schedule.get('show_id'));
      return showId == schedule.get('show_id');
    });
  
    if(!this.show) {
      this.show = Ext.create('dcm14.view.show.Detail');
    }

    this.show.config.title = record.get('show_name');
    this.getShowContainer().push(this.show);
    this.getShowInfo().setRecord(record);

  }
});