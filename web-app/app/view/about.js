Ext.define('dcm14.view.about', {
  extend: 'Ext.Container',
  xtype: 'about',
  
  config: {
    scrollable: true,
    title: 'About',
    iconCls: 'team',
    html: ['<div style="text-align:center;padding-top:10px;"><img style="text-align:center;max-width:300px;padding:10px;" src="http://delclosemarathon.com/dcm14/mobile/images/ico_appstore.jpg"/></div><br/><br/><h1 style="text-align:center;font-weight:bold;">DCM14 mobile experience by:</h1><ul style="text-align:center;font-weight:bold;"><li><a href="http://twitter.com/#!/willhines" target="_blank">@willhines</a></li><li><a href="http://twitter.com/#!/benzado/" target="_blank">@benzado</a></li><li><a href="https://twitter.com/#!/heykurtg" target="_blank">@heykurtg</a></li><li><a href="http://twitter.com/#!/kmsimon/" target="_blank">@kmsimon</a></li><li><a href="https://twitter.com/#!/JohnRobertWilso" target="_blank">@JohnRobertWilso</a></li></ul>']
  }  
});