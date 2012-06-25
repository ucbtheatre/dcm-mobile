Ext.define('dcm14.store.Favorites', {
  extend: 'Ext.data.Store', 
  config : {
    storeId: 'Favorites',
    model: 'dcm14.model.Favorite'
  },
  setCookie:function(c_name, c_value) {
    document.cookie=c_name + "=" + c_value;
  },
  getCookie:function(c_name) {
    var i,x,y,dcmCookies=document.cookie.split(";");
		for (i=0;i<dcmCookies.length;i++)
		{
		  x=dcmCookies[i].substr(0,dcmCookies[i].indexOf("="));
		  y=dcmCookies[i].substr(dcmCookies[i].indexOf("=")+1);
		  x=x.replace(/^\s+|\s+$/g,"");
		  if (x==c_name)
		    {
		    return unescape(y);
		    }
		  }
  },
  getFavorites:function() {
    return this.getCookie('dcm14-favorites');
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
      this.add({show_id: show_id});
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
  }
});