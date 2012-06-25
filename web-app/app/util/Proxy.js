Ext.define('dcm14.util.Proxy', {
  singleton: true,
  process: function(url, callback) {
    var scheduleStore = Ext.getStore('Schedules');
    var showStore = Ext.getStore('Shows');
    var venueStore = Ext.getStore('Venues');
    var favoritesStore = Ext.getStore('Favorites');
    // console.log(scheduleStore, showStore, venueStore);
    // console.log('Loading Schedules...');
    venueStore.load(function(){
      scheduleStore.load(function() {
        // console.log('Loading Shows...');
        showStore.load(function() {
          // console.log('Loading Venues...');
          // console.log('Loading Complete!');
          favoritesStore.load(function() {
            callback();
          })
        })
      })
    });
  }
});