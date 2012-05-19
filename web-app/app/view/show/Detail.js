Ext.define('dcm14.view.show.Detail', {
  extend: 'Ext.Container',
  xtype: 'show',
  
  config: {
    layout: 'vbox',
    scrollable: true,
    title: '',
    items:[
      {
        xtype: 'showInfo'
      },
      {
        xtype: 'schedules',
        store: 'Schedules',
        scrollable: false,
      
        items: [
          {
            xtype: 'listitemheader',
            cls: 'dark',
            html: 'Schedules'
          }
        ]
      }
    ]
  }  
});