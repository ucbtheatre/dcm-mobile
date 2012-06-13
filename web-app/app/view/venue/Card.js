Ext.define('dcm14.view.venue.Card', {
  extend: 'Ext.NavigationView',
  xtype: 'venueContainer',
  
  config: {
    title: 'Venues',
    iconCls: 'info',
    
    autoDestroy: false,

    items:[
      {
        xtype: 'venues',
        store: 'Venues',
        grouped: false,
        pinHeaders: true
      }
    ]
  }  
});