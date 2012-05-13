Ext.define('dcm14.view.NavShows', {
  extend: 'Ext.navigation.View',
  xtype: 'showsnav',
  config:{iconCls:'info', title:'Shows',
    items:[
      {xtype:'showspanel'}
    ]
  }
});