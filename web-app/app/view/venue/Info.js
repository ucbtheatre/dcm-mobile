Ext.define('dcm14.view.venue.Info', {
  extend: 'Ext.Component',
  xtype: 'venueInfo',
  
  config: {
    cls: 'venueInfo',
    tpl: Ext.create('Ext.XTemplate',
      '<div style="text-align:center;padding-top:10px;"><img style="max-width:400px;" src="{image}" /></div>',
      '<h4 style="text-align:center;">{address}</h4>',
      '<h4>{directions}</h4>',
      '<h4 style="text-align:center;"><a href="{gmaps}">Map it!</a></h4>'
    )
  }
});