Ext.define('dcm14.store.Favorites', {
  extend: 'Ext.data.Store', 
  config : {
    storeId: 'Favorites',
    model: 'dcm14.model.Favorite'
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
      favorite_object = {show_id: show.data.id, show_name: show.data.show_name };
      this.add(favorite_object);
      this.sync();
      console.log('Favorite added ' + show_id);
    }
  },
  removeFavorite:function(show_id) {
    fave_exists = this.isInFavorites(show_id);
    if (fave_exists) {
      fave_index = this.find('show_id', show_id);
      this.removeAt(fave_index);
      this.sync();
      console.log('Favorite removed ' + show_id);
    }
  },
  getShowData:function(show_id) {
    showsStore = Ext.getStore('Shows');
    showIndex = showsStore.find('id', show_id);
    show = showsStore.getAt(showIndex);
    return show;
  }
});