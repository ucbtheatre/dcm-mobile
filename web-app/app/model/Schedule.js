Ext.define('dcm14.model.Schedule', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'int' },
            { name: 'show_id', type: 'int' },
            { name: 'venue_id', type: 'int' },
            { name: 'starttime', type: 'int' },
            { name: 'endtime', type: 'int' },
            { name: 'minutes', type: 'int' },
            { name: 'time_display', type: 'string' },
            { name: 'short_time', type: 'string' },
            { name: 'venue_short_name', type: 'string' },
            { name: 'show_name', type: 'string' }
        ],
        associations: { type: 'hasOne', model: 'dcm14.model.Venue' },
        proxy: {
          type:'localstorage',
          id: 'SchedulesStorage'
        }
    }
});