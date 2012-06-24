Ext.define('dcm14.controller.Shows', {
  extend: 'Ext.app.Controller',
  config: {
    refs: {
      shows: 'shows',
      show: 'show',
      showInfo: 'showContainer showInfo',
      showPerformers: 'showContainer list',
      showContainer: 'showContainer', 
      showSchedules: 'showContainer list',
      showFavoriteButton: 'showContainer show toolbar button'
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
    var showStore = Ext.getStore('Shows');
    var showId = record.get('id');
    
    scheduleStore.clearFilter();
    scheduleStore.filter('show_id', showId);

    if(!this.show) {
      this.show = Ext.create('dcm14.view.show.Detail');
    }

    this.show.config.title = record.get('show_name');
    this.getShowContainer().push(this.show);
    this.getShowInfo().setRecord(record);

    fave_button = this.getShowFavoriteButton();
    fave_button.clearListeners();
    fave_button.addListener('tap', function(event_name, args) {
      console.log('favorite show_id: ' + showId);
      if (args.target.classList.contains('star-active')) {
        args.target.classList.remove('star-active');
	      args.target.classList.add('star');
      } else {
        args.target.classList.remove('star');
	      args.target.classList.add('star-active');
      }
    });
  }
});