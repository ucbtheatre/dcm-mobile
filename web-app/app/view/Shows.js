Ext.define('dcm14.view.Shows', {
    extend: 'Ext.List',
    xtype: 'showspanel',
    config: {
        html: '',
        fullscreen: true,
        title: 'Shows',
        ui: 'round',
        onItemDisclosure: function(record, btn, index){
          
        },
        listeners: {
          select:function(view, record){
            parent = view.getParent();
            this_store = this.getStore();
            // console.log(this_store.getAt(record.internalId));
            parent.push({ html: record.data.show_name + "<br/>" + record.raw.promo_blurb + "<br/><br/>" + record.raw.cast.join("<br/>")});
          }
        },
        store : 'Shows',
        itemTpl : '{show_name}'
    }
});