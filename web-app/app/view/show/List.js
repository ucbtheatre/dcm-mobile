Ext.define('dcm14.view.show.List', {
  extend: 'Ext.List',
  xtype: 'shows',
  
  config: {
    items: [],
    itemTpl: ['<div class="show"><div class="title">{show_name}</div><div class="time">rawr</div></div>']
  },
  
  initialize: function() {
    this.config.title = dcm14.app.title;
    this.callParent();
  } 

});