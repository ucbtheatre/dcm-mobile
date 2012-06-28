Ext.define('dcm14.view.venue.List', {
  extend: 'Ext.List',
  xtype: 'venues',
  
  config: {
    items: [],
    itemTpl: ['<div class="venue"><div class="title">{name}</div><div class="x-list-disclosure "></div></div>']
  },
  
  initialize: function() {
    this.config.title = 'Venues';
    this.callParent();
  } 

});