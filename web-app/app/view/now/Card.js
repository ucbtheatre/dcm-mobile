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
// this.config.data = [{endtime:12345}];
// this.setData();
// console.log(this);
// console.log(data);
                // this.setData([{endtime:12345}]);
// console.log(HappeningNow.getUcbLatest(1234));
              }
            }
      }]
  }  
});