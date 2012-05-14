Ext.define('dcm14.store.Schedules', {
  extend: 'Ext.data.Store', 
  config : {
    model: 'dcm14.model.Schedule',
    storeId: 'Schedules',
    proxy: {
        type: 'ajax',
        url : 'dcm13data.json',
        reader: { type : 'json', rootProperty : 'Schedules', record : 'Schedule' }
    },
  }
});