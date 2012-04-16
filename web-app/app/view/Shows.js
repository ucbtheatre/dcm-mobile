Ext.define('dcm14.view.Shows', {
    extend: 'Ext.List',
    xtype: 'showspanel',
    config: {
        html: '',
        fullscreen: true,
        title: 'Shows',
        iconCls: 'info',
        store : 'Shows',
        itemTpl : '{show_name}'
    }
});