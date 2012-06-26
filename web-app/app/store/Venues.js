Ext.define('dcm14.store.Venues', {
  extend: 'Ext.data.Store', 
  config : {
    model: 'dcm14.model.Venue',
    storeId: 'Venues',
    proxy: {
        type: 'ajax',
        url : 'dcm14data.json',
        reader: { type : 'json', rootProperty : 'Venues', record : 'Venue' }
    },
  }
});