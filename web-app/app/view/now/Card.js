Ext.define('dcm14.view.now.Card', {
  extend: 'Ext.NavigationView',
  xtype: 'nowContainer',
  config: {
    title: 'Now',
    iconCls: 'action',
    // listeners:{show:function(){console.log('nav loaded!');this.config.title = 'NAV LOADED';}},
    autoDestroy: false,
    emptyText: 'Placeholder container',
    items:[{xtype:'list', grouped:true, id:'nowList',
            store: 'HappeningNow',
            itemTpl:'<div>{show_name}</div><div style="float:right;margin-top:-17px;">{short_time}</div>',
            listeners:{
              show:function() {
                HappeningNow = Ext.getStore('HappeningNow');
                HappeningNow.getCurrentlyPlayingShows(1234);
              },
              initialize:function() {
                current_time = new Date();
                meridian = ' AM';
                hours = current_time.getHours();
                if (hours > 12) {
                  meridian = ' PM';
                  hours -= 12;
                }
                minutes = current_time.getMinutes();
                if (minutes == 0) {
                  minutes = '00';
                }
                if(minutes < 10) {
                  minutes = '0' + minutes;
                }
                seconds = current_time.getSeconds();
                if (seconds < 10) {
                  seconds = '0' + seconds;
                }
                day = current_time.getDay();
                day_string = 'Wed';
                switch (day) {
                  case 4:
                    day_string = 'Thu';
                    break;
                  case 5:
                    day_string = 'Fri';
                    break;
                  case 6:
                    day_string = 'Sat';
                     break;
                  case 0:
                    day_string = 'Sun';
                    break;
                }
                // this.config.title = day_string + ' ' + hours + ':' + minutes + ' ' + meridian;
              }
            }
      }]
  }  
});