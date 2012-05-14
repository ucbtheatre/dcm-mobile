Ext.define('dcm14.view.ShowDetail', {
  extend: 'Ext.Panel',
  title: 'ShowDetail',
  fullscreen: true,
  config: {title: 'ShowDetail', scrollable:{direction:'vertical', directionLock:true},
  items:[{xtype:'panel', html: 'ok', tpl: '{show_name}<br/><br/>{promo_blurb}<br/><br/>{home_city}', height:'50%'},
  { xtype:'list', height:'50%', tpl:'{name}', itemTpl:'{name}'}]}
});