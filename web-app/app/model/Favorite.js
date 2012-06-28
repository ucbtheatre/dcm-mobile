Ext.define('dcm14.model.Favorite', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name:'show_id', type: 'int' },
            { name: 'show_name', type: 'string' },
            { name: 'day_string', type: 'string' },
            { name: 'starttime_string', type: 'string'},
            { name: 'starttime', type: 'int' },
            { name: 'endtime', type: 'int' }
        ],
        proxy: {
          type:'localstorage',
          id: 'favoritesStorage'
        }
    }
});