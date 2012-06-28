Ext.define('dcm14.view.show.Info', {
  extend: 'Ext.Component',
  xtype: 'showInfo',
  
  config: {
    cls: 'showInfo',
    tpl: Ext.create('Ext.XTemplate',
      '<p style="padding:10px;font-weight:bold;">{promo_blurb}</p>',
      '<p style="padding:10px;">{cast_string}</p>'
    )
  }
});