Ext.define('dcm14.controller.Venues', {
  extend: 'Ext.app.Controller',
  config: {
    refs: {
      venues: 'venues',
      venue: 'venue',
      venueInfo: 'venueContainer venueInfo',
      venueContainer: 'venueContainer'
    },
    control: {
      venues: {
        initialize: 'initVenues',
        itemtap: 'onVenueTap'
      }
    }
  },

  initVenues: function() {
    // console.log('Hello Venues!');
  },

  onVenueTap: function(list, idex, el, record) {
    var venueStore = Ext.getStore('Venues');
    var venueId = record.get('id');
    if(!this.venue) {
      this.venue = Ext.create('dcm14.view.venue.Detail');
    }

    this.venue.config.title = record.get('name');
    this.getVenueContainer().push(this.venue);
    this.getVenueInfo().setRecord(record);
  }

});