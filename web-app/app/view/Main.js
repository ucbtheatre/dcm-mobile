Ext.define("dcm14.view.Main", {
    extend: 'Ext.tab.Panel',
    xtype: 'main',

    config: {
        tabBarPosition: 'bottom',
        items: [ 
          { xclass: 'dcm14.view.show.Card' }
        ]
    }
});
