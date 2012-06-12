Ext.define('dcm14.model.Venue', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'int' },
            { name: 'name', type: 'string' },
            { name: 'short_name', type: 'string' },
            { name: 'address', type: 'string' },
            { name: 'image', type: 'string' },
            { name: 'gmaps', type: 'string' }
        ]
    }
});