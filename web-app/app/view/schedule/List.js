Ext.define('dcm14.view.schedule.List', {
  
  extend: 'Ext.List',
  xtype: 'schedules',
  
  config: {
    title: 'Schedules',
    
 //   itemCls: 'schedule',
    itemTpl: [
      '<div>{starttime}</div>'
    ]
  }
});