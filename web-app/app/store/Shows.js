Ext.define('dcm14.store.Shows', {
  extend: 'Ext.data.Store', 
  config : {
    model: 'dcm14.model.Show',
    sorters: ['show_name'],
    storeId: 'Shows',
    proxy: {
        type: 'ajax',
        url : 'dcm14data.json',
        reader: { type : 'json', rootProperty : 'Shows', record : 'Show' }
    },
    grouper: {
      groupFn:function(record) {
        return record.get('show_name').substr(0,1);
      },
      sortProperty: 'show_name',
    }
  }
});