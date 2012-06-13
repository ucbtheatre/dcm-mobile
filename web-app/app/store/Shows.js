Ext.define('dcm14.store.Shows', {
  extend: 'Ext.data.Store', 
  config : {
    model: 'dcm14.model.Show',
    sorters: ['show_name'],
    storeId: 'Shows',
    proxy: {
        type: 'ajax',
        url : 'dcm13data.json',
        reader: { type : 'json', rootProperty : 'Shows', record : 'Show' }
    },
  }
});