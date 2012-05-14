Ext.define('dcm14.view.NavVenues', {
  extend: 'Ext.navigation.View',
  xtype: 'venuesnav',
  config:{iconCls:'locate', title:'Venues',
    items: [
      {xtype:'venuespanel'}
    ]
  }
});