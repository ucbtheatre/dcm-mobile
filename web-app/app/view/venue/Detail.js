Ext.define('dcm14.view.venue.Detail', {
  extend: 'Ext.Container',
  xtype: 'venue',
  
  config: {
    layout: 'vbox',
    scrollable: true,
    title: '',
    items:[
      {
        xtype: 'venueInfo'
      }
    ]
  }  
});