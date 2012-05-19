Ext.define('dcm14.model.Show', {
    extend: 'Ext.data.Model',
    config: {
        fields: [
            { name: 'id', type: 'int' },
            { name: 'show_name', type: 'string' },
            { name: 'promo_blurb', type: 'string' },
            { name: 'home_city', type: 'string' },
            { name: 'cast', type:'auto' }
        ]
    }
});