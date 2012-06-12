Ext.define('dcm14.view.venue.List', {
  extend: 'Ext.List',
  xtype: 'venues',
  
  config: {
    items: [],
    itemTpl: ['<div class="show"><div class="title">{name}</div>']
  },
  
  initialize: function() {
    this.config.title = dcm14.app.title;
    this.callParent();
  } 

});