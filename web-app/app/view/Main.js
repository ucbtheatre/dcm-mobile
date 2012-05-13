Ext.define("dcm14.view.Main", {
    extend: 'Ext.tab.Panel',
    requires: ['Ext.TitleBar'],
    
    config: {
        tabBarPosition: 'bottom',
        
        items: [ 
          {
            xtype: 'homepanel'
          },
          { xtype: 'showsnav' },
          { xtype: 'venuesnav' }
        ]
    }
});