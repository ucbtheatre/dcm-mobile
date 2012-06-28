Ext.define('dcm14.model.Favorite', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name:'show_id', type: 'int' },
            { name: 'show_name', type: 'string' },
            { name: 'day_name', type: 'string' }
        ],
        proxy: {
          type:'localstorage',
          id: 'favoritesStorage'
        }
    }
});