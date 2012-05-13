//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src'
});
//</debug>

Ext.application({
    name: 'dcm14',

    requires: [
        'Ext.MessageBox'
    ],

    views: ['Main', 'Home', 'Shows', 'NavShows'],

    models: ['Performer', 'Show', 'Schedule', 'Venue'],

    stores: ['Venues', 'Shows'],

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
        Ext.fly('appLoadingIndicator').destroy();

        // Initialize the main view
        Ext.Viewport.add(Ext.create('dcm14.view.Main'));

        // Venues
        Ext.getStore('Venues').load(function(venues){
          Ext.each(venues, function(venue){
            // console.log('Venue');
            // console.log(venue);
          });
        });

        // Shows
        Ext.getStore('Shows').load(function(shows){
          Ext.each(shows, function(show){
            // console.log('Show');
            // console.log(show);
          });
        });
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
