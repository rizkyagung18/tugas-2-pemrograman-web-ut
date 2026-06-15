ApiService.loadData().then(function(data) {

  new Vue({
    el: '#app',

    data: {
      tab: 'stok',

      upbjjList: data.upbjjList,
      kategoriList: data.kategoriList,
      stok: data.dataBahanAjar,
      paket: data.paket,
      daftarDO: []
    },

    methods: {
      tambahStok: function(item) {
        var newId = this.stok.length > 0
          ? Math.max.apply(null, this.stok.map(function(x) { return x.id; })) + 1
          : 1;
        this.stok.push(Object.assign({}, item, { id: newId }));
      },

      updateStok: function(item) {
        var idx = this.stok.findIndex(function(x) { return x.id === item.id; });
        if (idx !== -1) this.$set(this.stok, idx, item);
      },

      hapusStok: function(id) {
        this.stok = this.stok.filter(function(x) { return x.id !== id; });
      },

      tambahDO: function(do_baru) {
        this.daftarDO.push(do_baru);
        this.tab = 'tracking';
      },

      tambahProgress: function(payload) {
        var do_item = this.daftarDO.find(function(d) { return d.nomorDO === payload.nomorDO; });
        if (!do_item) return;
        var now = new Date();
        var waktu = now.toLocaleDateString('id-ID') + ' ' + now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        do_item.progress.push({ waktu: waktu, keterangan: payload.keterangan });
      }
    }
  });

});
