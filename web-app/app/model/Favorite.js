Ext.define('dcm14.model.Favorite', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name:'show_id', type: 'int' }
        ],
        proxy: {
          type:'localstorage',
          id: 'favoritesStorage'
        }
    }
});