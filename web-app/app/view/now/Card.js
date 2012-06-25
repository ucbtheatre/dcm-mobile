Ext.define('dcm14.view.now.Card', {
  extend: 'Ext.NavigationView',
  xtype: 'nowContainer',
  
  config: {
    title: 'Now',
    iconCls: 'action',
    
    autoDestroy: false,
    emptyText: 'Placeholder container',
    items:[]
  }  
});