Ext.define('dcm14.store.Favorites', {
  extend: 'Ext.data.Store', 
  config : {
    storeId: 'Favorites',
    fields:['id', 'show_id'],
    proxy: {
        type: 'localstorage',
        id: 'favoritesStore'
    },
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
  addFavorite:function(show_id) {
    current_favorites_string = this.getFavorites();
    current_favorites_array = current_favorites_string.split('|');
    current_favorites_array.push(show_id);
    new_favorites_string = current_favorites_array.join('|');
    this.setCookie('dcm14-favorites', new_favorites_string);
    return;
  },
  removeFavorite:function(show_id) {
    current_favorites_string = this.getFavorites();
    current_favorites_array = current_favorites_string.split('|');
    index = current_favorites_array.indexOf(show_id);
    current_favorites_array.splice(index, 1);
    new_favorites_string = current_favorites_array.join('|');
    this.setCookie('dcm14-favorites', new_favorites_string);
    return;
  }
});