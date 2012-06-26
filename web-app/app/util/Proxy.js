Ext.define('dcm14.util.Proxy', {
  singleton: true,
  process: function(url, callback) {
    var showStore = Ext.getStore('Shows');
    var scheduleStore = Ext.getStore('Schedules');
    var venueStore = Ext.getStore('Venues');
    var favoritesStore = Ext.getStore('Favorites');
    // console.log(scheduleStore, showStore, venueStore);
    // console.log('Loading Schedules...');
    venueStore.load(function(){
	    showStore.load(function() { console.log('Show Store loading!');
        scheduleStore.load(function() { console.log('Schedules loading!');
          favoritesStore.load(function() {
            callback();
          })
        })
      })
    });
  }
});