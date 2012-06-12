//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src'
});
//</debug>

Ext.application({
    name: 'dcm14',

    title: 'DCM XIV',

    requires: [
      'Ext.MessageBox',
      'dcm14.util.Proxy'
    ],

    stores: [
      'Schedules',
      'Shows',
      'Venues'
    ],

    models: [
      'Performer',
      'Schedule',
      'Show',
      'Venue'
    ],

    views: [
      'Main',
      'show.Card',
      'show.List',
      'show.Detail',
      'show.Info',
      'schedule.List',
      'venue.Card',
      'venue.List',
      'venue.Info',
      'venue.Detail'
    ],

    controllers: [
      'Shows',
      'Venues'
    ],

    icon: {
        57: 'resources/icons/Icon.png',
        72: 'resources/icons/Icon~ipad.png',
        114: 'resources/icons/Icon@2x.png',
        144: 'resources/icons/Icon~ipad@2x.png'
    },
    
    phoneStartupScreen: 'resources/loading/Homescreen.jpg',
    tabletStartupScreen: 'resources/loading/Homescreen~ipad.jpg',

    launch: function() {
        // Destroy the #appLoadingIndicator element
        // Ext.fly('appLoadingIndicator').destroy();
        Ext.Viewport.setMasked({ xtype: 'loadmask' });
        dcm14.util.Proxy.process('dcm13data.json', function() {
          Ext.Viewport.add(Ext.create('dcm14.view.Main'));
          Ext.Viewport.setMasked(false);
        })
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    },
});
