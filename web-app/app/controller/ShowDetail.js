Ext.define('dcm14.controller.ShowDetail', {
  extend: 'Ext.app.Controller',
  config : {
    routes: {
      'shows/:id': 'showDetail'
    },
    refs: {
	    showspanel:{xtype: 'showspanel'}
    },
    stores:['Shows', 'Schedules']
  },
  showDetail:function(id) {
    dcm14.model.Show.load(id);
    showStore = Ext.getStore('Shows');
    // view = Ext.getCmp('showdetailview');
    // view = dcm14.view.ShowDetail.load();
    // Ext.Viewport.add(Ext.create('dcm14.view.NavShows'));
    // show_detail_view.push({show_name:'pushed from show detail'});

    console.log('done pushing');
  }
});