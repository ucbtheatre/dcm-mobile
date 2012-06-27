Ext.define('dcm14.view.now.Card', {
  extend: 'Ext.NavigationView',
  xtype: 'nowContainer',
  
  config: {
    title: 'Now',
    iconCls: 'action',
    
    autoDestroy: false,
    emptyText: 'Placeholder container',
    items:[{xtype:'list', ui:'round', grouped:true, pinHeaders:false,
            store: 'HappeningNow',
            itemTpl:'<div>{show_name} {short_time}</div>',
            listeners:{
              show:function() {
                HappeningNow = Ext.getStore('HappeningNow');
                HappeningNow.getCurrentlyPlayingShows(1234);
              }
            }
      }]
  }  
});