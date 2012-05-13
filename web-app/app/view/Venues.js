Ext.define('dcm14.view.Venues', {
    extend: 'Ext.List',
    xtype: 'venuespanel',
    config: {
        html: '',
        fullscreen: true,
        title: 'Venues',
        ui: 'round',
        onItemDisclosure: function(record, btn, index){
          
        },
        listeners: {
          select:function(view, record){
            parent = view.getParent();
            this_store = this.getStore();
            // console.log(this_store.getAt(record.internalId));
            parent.push({ html: 'test venue detail'});
          }
        },
        store : 'Venues',
        itemTpl : '{name}'
    }
});