Ext.define('dcm14.view.venue.Info', {
  extend: 'Ext.Component',
  xtype: 'venueInfo',
  
  config: {
    cls: 'venueInfo',
    tpl: Ext.create('Ext.XTemplate',
      '<h3>{name}</h3>',
      '<img style="max-width:500px;" src="{image}" />',
      '<h4>{address}</h4>',
      '<h4>{directions}</h4>',
      '<h4><a href="{gmaps}">Map it!</a></h4>'
    )
  }
});