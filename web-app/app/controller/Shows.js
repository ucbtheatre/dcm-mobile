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
    scheduleStore.filter('show_id', showId);

    if(!this.show) {
      this.show = Ext.create('dcm14.view.show.Detail');
    }

    this.show.config.title = record.get('show_name');
    this.getShowContainer().push(this.show);
    this.getShowInfo().setRecord(record);

    fave_button = this.getShowFavoriteButton();
    is_a_favorite = favoritesStore.isInFavorites(showId);
    if (is_a_favorite) {
star_index = fave_button.iconElement.classList.indexOf('star');
fave_button.iconElement.classList.splice(star_index, 1);
fave_button.iconElement.classList.push('star-active');

element = document.getElementById('ext-element-368');
element.className = 
   element.className.replace
      ( /(?:^|\s)star(?!\S)/ , '' );
element.className += " star-active";
    } else {
    	element = document.getElementById('ext-element-368');
			element.className = 
			   element.className.replace
			      ( /(?:^|\s)star-active(?!\S)/ , '' );
			element.className += " star";
    }

    has_this_as_favorite = favoritesStore.isInFavorites(showId);
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