Ext.define('dcm14.model.Schedule', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'int' },
            { name: 'show_id', type: 'int' },
            { name: 'venue_id', type: 'int' },
            { name: 'starttime', type: 'int' },
            { name: 'endtime', type: 'int' },
            { name: 'minutes', type: 'int' }
        ],
        associations: { type: 'hasOne', model: 'dcm14.model.Venue' }
    }
});