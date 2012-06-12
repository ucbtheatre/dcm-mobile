Ext.define('dcm14.view.show.List', {
  extend: 'Ext.List',
  xtype: 'shows',
  
  config: {
    items: [
      { xtype : 'toolbar', docked : 'top',
        items: [
          { xtype : 'spacer' },
          { xtype: 'searchfield', placeHolder: 'Search...',
            listeners: {
              scope: this,
              // clearicontap: this.onSearchClearIconTap,
              // keyup: this.onSearchKeyUp
            }
          },
          { xtype: 'spacer' }
        ]
      }
    ],
    itemTpl: ['<div class="show"><div class="title">{show_name}</div><div class="time">rawr</div></div>']
  },
  
  initialize: function() {
    this.config.title = dcm14.app.title;
    this.callParent();
  }, 
  onSearchKeyUp: function (f) {
	console.log('keyup');
    var e = f.getValue(),
      b = this.getStore();
    b.clearFilter();
    if (e) {
      var d = e.split(" "),
        a = [],
        c;
      for (c = 0; c < d.length; c++) {
        if (!d[c]) {
          continue
        }
        a.push(new RegExp(d[c], "i"))
      }
      b.filter(function (h) {
        var g = [];
        for (c = 0; c < a.length; c++) {
          var j = a[c],
            i = h.get("show_name").match(j);
          g.push(i)
        }
        if (a.length > 1 && g.indexOf(false) != -1) {
          return false
        } else {
          return g[0]
        }
      })
    }
  },
  onSearchClearIconTap: function () {
    this.getStore().clearFilter()
  }
});