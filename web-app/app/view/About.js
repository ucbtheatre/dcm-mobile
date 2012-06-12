Ext.define('dcm14.view.about', {
  extend: 'Ext.Container',
  xtype: 'about',
  
  config: {
    scrollable: true,
    title: 'About',
    iconCls: 'team',
    html: ['<img src="/images/ico_appstore.jpg"/><br/><br/><h1>This app Created by:</h1><ul><li>Will Hines</li><li>Benjamin Ragheb</li><li>Kurt Geunther</li><li>John Robert Wilson</li></ul>']
  }  
});