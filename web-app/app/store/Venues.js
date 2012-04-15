Ext.define('dcm14.store.Venues', {
  extend: 'Ext.data.Store', 
  config : {
    model: 'dcm14.model.Venue',
    proxy: {
        type: 'ajax',
        url : 'dcm13data.json',
        reader: { type : 'json', rootProperty : 'Venues', record : 'Venue' }
    },
  }
});