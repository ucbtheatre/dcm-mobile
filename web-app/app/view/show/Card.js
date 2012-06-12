Ext.define('dcm14.view.show.Card', {
  extend: 'Ext.NavigationView',
  xtype: 'showContainer',
  
  config: {
    title: 'All Shows',
    iconCls: 'info',
    
    autoDestroy: false,

    items:[
      {
        xtype: 'shows',
        store: 'Shows',
        grouped: false,
        pinHeaders: true
      }
    ]
  }  
});