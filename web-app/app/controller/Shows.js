Ext.define('dcm14.controller.Shows', {
  extend: 'Ext.app.Controller',
  config: {
    refs: {
      shows: 'shows',
      show: 'show',
      showInfo: 'showContainer showInfo',
      showPerformers: 'showContainer list',
      showContainer: 'showContainer', 
      showSchedules: 'showContainer list',
      showFavoriteButton: 'showContainer show toolbar button'
    },
    control: {
      shows: {
        initialize: 'initShows',
        itemtap: 'onShowTap'
      }
    }
  },

  initShows: function() {
    // console.log('Hello Shows!');
  },

  onShowTap: function(list, idex, el, record) {
    var scheduleStore = Ext.getStore('Schedules');
    var showStore = Ext.getStore('Shows');
    var favoritesStore = Ext.getStore('Favorites');
    var showId = record.get('id');
    
    scheduleStore.clearFilter();
    // scheduleStore.filter('show_id', showId, false, false);
    scheduleStore.filterBy(function(record, id) {
       show_id_from_record = record.get('show_id');
       if (show_id_from_record == showId) { return true; }
     });
    if(!this.show) {
      this.show = Ext.create('dcm14.view.show.Detail');
    }
    cast_array = record.data.cast;
    record.data.cast_string = cast_array.join(',');
    this.show.config.title = record.get('show_name');
    this.getShowContainer().push(this.show);
    this.getShowInfo().setRecord(record);

    fave_button = this.getShowFavoriteButton();
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
  }
});