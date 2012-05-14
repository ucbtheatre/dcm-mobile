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
            show_detail = Ext.create('dcm14.view.ShowDetail');
            show_detail.setData(record.data);
            show_detail.items.items[0].setData(record.data);
            performers = [];
              for(i=0; i < record.data.cast.length; i++) {
                performers.push({name:record.data.cast[i]});
              }
            // show_detail.items.items[1].setData({text:'Performers', children: performers});
            // console.log(show_detail.items.items[1]);
            parent.push(show_detail);
          }
        },
        store : 'Shows',
        itemTpl : '{show_name}'
    }
});