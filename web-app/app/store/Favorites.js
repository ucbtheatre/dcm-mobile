Ext.define('dcm14.store.Favorites', {
  extend: 'Ext.data.Store', 
  config : {
    storeId: 'Favorites',
    model: 'dcm14.model.Favorite',
    grouper : {
      property: 'day_string',
      sortProperty: 'starttime',
      direction: 'ASC',
    },
  },
  isInFavorites:function(show_id) {
    fave_index = this.find('show_id', show_id);
    if (fave_index == -1) {
      return false;
    } else {
      return true;
    }
  },
  addFavorite:function(show_id) {
    fave_exists = this.isInFavorites(show_id);
    if (!fave_exists) {
      show = this.getShowData(show_id);
      show_id = show.data.id;
      scheduleStore = Ext.getStore('Schedules');
      scheduleIndex = scheduleStore.find('show_id', show_id, 0, false, false, true);
      scheduleModel = scheduleStore.getAt(scheduleIndex);
      starttime = new Date(scheduleModel.data.starttime*1000);
      show_day = starttime.getDay();
      show_day_string = 'Friday, June 29th 2012';
      switch (show_day) {
        case 6:
         show_day_string = 'Saturday, June 30th 2012';
         break;
        case 0:
          show_day_string = 'Sunday, July 1st 2012';
      }
      meridian = ' AM';
      hours = starttime.getHours();
      if (hours > 12) {
        meridian = ' PM';
        hours -= 12;
      }
      minutes = starttime.getMinutes();
      if (minutes == 0) {
        minutes = '00';
      }
      time_string = hours + ':' + minutes + ' ' + meridian;
      favorite_object = {
        show_id: show.data.id,
        show_name: show.data.show_name,
        day_string:show_day_string, starttime:scheduleModel.data.starttime,
        starttime_string:time_string
      };

      this.add(favorite_object);
      this.sync();
      // console.log('Favorite added ' + show_id);
    }
  },
  removeFavorite:function(show_id) {
    fave_exists = this.isInFavorites(show_id);
    if (fave_exists) {
      fave_index = this.find('show_id', show_id);
      this.removeAt(fave_index);
      this.sync();
      // console.log('Favorite removed ' + show_id);
    }
  },
  getShowData:function(show_id) {
    showsStore = Ext.getStore('Shows');
    showIndex = showsStore.find('id', show_id);
    show = showsStore.getAt(showIndex);
    return show;
  }
});