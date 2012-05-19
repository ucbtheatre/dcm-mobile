Ext.define('dcm14.util.Proxy', {
  singleton: true,
  process: function(url, callback) {
    var scheduleStore = Ext.getStore('Schedules');
    var showStore = Ext.getStore('Shows');
    var venueStore = Ext.getStore('Venues');
    console.log(scheduleStore, showStore, venueStore);
    console.log('Loading Schedules...');
    scheduleStore.load(function() {
      console.log('Loading Shows...');
      showStore.load(function() {
        console.log('Loading Venues...');
        venueStore.load(function() {
          console.log('Loading Complete!');
          callback();
        })
      })
    });
  }
});