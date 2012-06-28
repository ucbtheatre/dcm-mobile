Ext.define('dcm14.view.favorite.Card', {
  extend: 'Ext.NavigationView',
  xtype: 'favoriteContainer',
  
  config: {
    title: 'Favorites',
    iconCls: 'favorites',
    
    autoDestroy: false,

    items:[
      {
        xtype: 'favorites',
        grouped: true,
        pinHeaders: false,
        store: 'Favorites'
      }
    ]
  }  
});