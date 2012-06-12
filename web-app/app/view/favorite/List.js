Ext.define('dcm14.view.favorite.List', {
  extend: 'Ext.List',
  xtype: 'favorites',
  
  config: {
    items: [{favorite_name:'test favorite'}],
    itemTpl: ['<div class="favorite"><div class="title">{favorite_name}</div>']
  },
  
  initialize: function() {
    this.config.title = dcm14.app.title;
    this.callParent();
  } 

});