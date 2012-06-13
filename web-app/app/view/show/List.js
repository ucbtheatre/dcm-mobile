Ext.define('dcm14.view.show.List', {
  extend: 'Ext.List',
  xtype: 'shows',
  ui: 'round',
  config: {
    items: [
      { xtype : 'toolbar', docked : 'top',
        items: [
          { xtype : 'spacer' },
          { xtype: 'searchfield', placeHolder: 'Search...',
            listeners: {
              // scope : this.dcm14.view.show.List,
              clearicontap: function() {
                showStore = Ext.getStore('Shows');
                showStore.clearFilter();
              },
              keyup: function(f) {
                showStore = Ext.getStore('Shows');
                value = f.getValue();
                if (value == '') {
                  showStore.clearFilter();
                } else {
                  showStore.filter("show_name", value, true, false);
                }
              }
            }
          },
          { xtype: 'spacer' }
        ]
      }
    ],
    itemTpl: ['<div class="show"><div class="title">{show_name}</div><div class="x-list-disclosure "></div></div>']
  },
  
  initialize: function() {
    this.config.title = dcm14.app.title;
    this.callParent();
  }
});