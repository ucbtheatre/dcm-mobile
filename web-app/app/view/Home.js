Ext.define('dcm14.view.Home', {
	extend: 'Ext.Panel',
	xtype: 'homepanel',
	config: {
		title: 'Home', 
		iconCls: 'home',
		cls: 'home',
		styleHtmlContent: true,
		html : ['<img src="http://thatotherpaper.com/files/ucb_logo.jpg" />', '<h1>DCM14 Sencha App</h1>'].join(""),
	}
});