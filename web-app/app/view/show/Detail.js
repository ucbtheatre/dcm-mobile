Ext.define('dcm14.view.show.Detail', {
  extend: 'Ext.Container',
  xtype: 'show',
  
  config: {
    layout: 'vbox',
    scrollable: true,
    title: '',
    items:[
      { 
        xtype: 'toolbar',
        docked: 'top',
        scrollable: false,
        ui:'neutral',
        defaults: {
          iconMask:true,
          ui:'plain'
        },
        items:[{iconCls:'star', alias:'widget.favoriteButton', enableToggle:true}],
        layout:{ pack: 'right', align: 'right' }
      },
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
            html: 'Showtimes'
          }
        ]
      }
    ]
  }
});