Ext.define('dcm14.view.show.Info', {
  extend: 'Ext.Component',
  xtype: 'showInfo',
  
  config: {
    cls: 'showInfo',
    tpl: Ext.create('Ext.XTemplate',
      '<h3>{show_name}</h3>',
      '<p>{promo_blurb}</p>'
    )
  }
});