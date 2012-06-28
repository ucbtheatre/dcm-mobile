Ext.define('dcm14.controller.HappeningNow', {
  extend: 'Ext.app.Controller',
  config: {
    refs: {
      shows: 'shows',
      show: 'show',
      showInfo: 'nowContainer showInfo',
      showPerformers: 'showContainer list',
      favoriteContainer: 'favoriteContainer', 
      showSchedules: 'showContainer list',
      showFavoriteButton: 'nowContainer show toolbar button',
      nowContainerObject: 'nowContainer',
      nowContainerList: 'nowContainer list',
    },
    control: {
      'nowContainer': {
        initialize: 'initHappeningNow'
      }
    }
  },

  initHappeningNow: function() {
    // console.log('Hello Happening NOw!');
    containerList = this.getNowContainerList();
    controllerRef = this;
    containerList.addListener('itemtap', function(list, idex, el, record) {
      var scheduleStore = Ext.getStore('Schedules');
      var showStore = Ext.getStore('Shows');
      var favoritesStore = Ext.getStore('Favorites');
      var showId = record.get('show_id');
      showIndex = showStore.find('id', showId);
      showModel = showStore.getAt(showIndex);

     scheduleStore.clearFilter();
     scheduleStore.filter('show_id', showId);
     showRef = controllerRef.getShow();
      if(!showRef) {
        showRef = Ext.create('dcm14.view.show.Detail');
      }
      controllerRef.getShow().config.title = record.get('show_name');
      controllerRef.getNowContainerObject().push(showRef);
      controllerRef.getShowInfo().setRecord(showModel);

      fave_button = controllerRef.getShowFavoriteButton();
      is_a_favorite = favoritesStore.isInFavorites(showId);
      if (is_a_favorite) {
        element = document.getElementById(fave_button.iconElement.getId());
        element.className = 
        element.className.replace( /(?:^|\s)star(?!\S)/ , '' );
        element.className += " star-active";
      } else {
        element = document.getElementById(fave_button.iconElement.getId());
        element.className = element.className.replace( /(?:^|\s)star-active(?!\S)/ , '' );
        element.className += " star";
      }

      fave_button.clearListeners();
      fave_button.addListener('tap', function(event_name, args) {
        favoritesStore = Ext.getStore('Favorites');
        has_this_as_favorite = favoritesStore.isInFavorites(showId);
        if (has_this_as_favorite) {
          favoritesStore.removeFavorite(showId);
          args.target.classList.remove('star-active');
          args.target.classList.add('star');
        } else {
          favoritesStore.addFavorite(showId);
          args.target.classList.remove('star');
          args.target.classList.add('star-active');
        }
      });
    });
  }
});