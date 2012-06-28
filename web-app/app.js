//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src'
});
//</debug>

Ext.application({
    name: 'dcm14',
    viewport : {
      autoMaximize : true
    },
    title: 'DCM XIV',

    requires: [
      'Ext.MessageBox',
      'dcm14.util.Proxy'
    ],

    stores: [
      'Schedules',
      'Shows',
      'Venues',
      'Favorites',
      'HappeningNow'
    ],

    models: [
      'Performer',
      'Schedule',
      'Show',
      'Venue',
      'Favorite'
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
      'venue.Detail',
      'about',
      'favorite.Card',
      'favorite.List',
      'now.Card'
    ],

    controllers: [
      'Shows',
      'Venues',
      'Favorites',
      'HappeningNow'
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
        window.scrollTo(0,1);
        setTimeout(function(){
           // Hide the address bar ( hack for iPhone )!
           window.scrollTo(0, 1);
        }, 0);
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
    }
});
