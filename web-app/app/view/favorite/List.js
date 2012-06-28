Ext.define('dcm14.view.favorite.List', {
  extend: 'Ext.List',
  xtype: 'favorites',
  prepareData:function(data, record_index, record) {
    showStore = Ext.getStore('Shows');
    showIndex = showStore.find('id', record.get('show_id'));
    show = showStore.getAt(showIndex);
    return_object = {show_id:record.get('show_id'), show_name:record.get('show_name'), starttime_string:record.get('starttime_string') }
    return return_object;
  },
  config: {
    itemTpl: ['<div class="favorite"><div class="title">{show_name}</div><div style="float:right;margin-top:-19px;">{starttime_string}</div></div>'],
    listeners:{
      afterrender: function(cmp) {
        cmp.refresh();
      }
    },
    emptyText: 'You have no favorite shows yet.'
  },
  initialize: function() {
    this.config.title = 'Favorites';
    this.callParent();
  }
});