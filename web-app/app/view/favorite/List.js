Ext.define('dcm14.view.favorite.List', {
  extend: 'Ext.List',
  xtype: 'favorites',
  config: {
    itemTpl: ['<div class="favorite"><div class="title">{show_id}</div>']
  },
  
  initialize: function() {
    this.config.title = dcm14.app.title;
    this.callParent();
  } 

});