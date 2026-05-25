new Vue({
  el: '#app',

  data: {
    daftarStok: dataBahanAjar.map(function(item) {
      return Object.assign({}, item);
    }),
    upbjjList: upbjjList,
    kategoriList: kategoriList,

    filterUpbjj: '',
    filterKategori: '',
    filterStok: '',
    sortBy: '',
    sortDir: 'asc',

    showModal: false,
    modeEdit: false,
    editId: null,

    form: {
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      qty: 0,
      safety: 0,
      harga: 0,
      catatanHTML: ''
    },

    errors: {}
  },

  computed: {
    dataFiltered: function() {
      var vm = this;
      var hasil = this.daftarStok.filter(function(item) {
        if (vm.filterUpbjj && item.upbjj !== vm.filterUpbjj) return false;
        if (vm.filterKategori && item.kategori !== vm.filterKategori) return false;
        if (vm.filterStok === 'menipis' && !(item.qty > 0 && item.qty < item.safety)) return false;
        if (vm.filterStok === 'kosong' && item.qty !== 0) return false;
        return true;
      });

      if (this.sortBy) {
        var key = this.sortBy;
        var dir = this.sortDir === 'asc' ? 1 : -1;
        hasil = hasil.slice().sort(function(a, b) {
          if (typeof a[key] === 'string') {
            return dir * a[key].localeCompare(b[key]);
          }
          return dir * (a[key] - b[key]);
        });
      }

      return hasil;
    }
  },

  watch: {
    filterUpbjj: function(val) {
      if (!val) {
        this.filterKategori = '';
      }
    },

    filterStok: function(val) {
      if (val === 'kosong') {
        this.sortBy = 'judul';
        this.sortDir = 'asc';
      }
    }
  },

  methods: {
    formatHarga: function(val) {
      return 'Rp ' + val.toLocaleString('id-ID');
    },

    setSort: function(key) {
      if (this.sortBy === key) {
        this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortBy = key;
        this.sortDir = 'asc';
      }
    },

    sortIndicator: function(key) {
      if (this.sortBy !== key) return '';
      return this.sortDir === 'asc' ? '^' : 'v';
    },

    resetFilter: function() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterStok = '';
      this.sortBy = '';
      this.sortDir = 'asc';
    },

    formKosong: function() {
      return {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        qty: 0,
        safety: 0,
        harga: 0,
        catatanHTML: ''
      };
    },

    bukaFormTambah: function() {
      this.modeEdit = false;
      this.editId = null;
      this.form = this.formKosong();
      this.errors = {};
      this.showModal = true;
    },

    bukaFormEdit: function(item) {
      this.modeEdit = true;
      this.editId = item.id;
      this.form = Object.assign({}, item);
      this.errors = {};
      this.showModal = true;
    },

    tutupModal: function() {
      this.showModal = false;
    },

    validasi: function() {
      var err = {};
      if (!this.form.kode.trim()) err.kode = 'Kode tidak boleh kosong';
      if (!this.form.judul.trim()) err.judul = 'Judul tidak boleh kosong';
      if (!this.form.kategori) err.kategori = 'Pilih kategori';
      if (!this.form.upbjj) err.upbjj = 'Pilih UT-Daerah';
      if (!this.form.lokasiRak.trim()) err.lokasiRak = 'Lokasi rak tidak boleh kosong';
      if (this.form.qty < 0) err.qty = 'Stok tidak boleh negatif';
      if (this.form.safety < 0) err.safety = 'Safety stock tidak boleh negatif';
      if (this.form.harga <= 0) err.harga = 'Harga harus lebih dari 0';
      this.errors = err;
      return Object.keys(err).length === 0;
    },

    simpan: function() {
      if (!this.validasi()) return;

      if (this.modeEdit) {
        var idx = this.daftarStok.findIndex(function(x) { return x.id === this.editId; }.bind(this));
        if (idx !== -1) {
          this.$set(this.daftarStok, idx, Object.assign({}, this.form, { id: this.editId }));
        }
      } else {
        var newId = this.daftarStok.length > 0
          ? Math.max.apply(null, this.daftarStok.map(function(x) { return x.id; })) + 1
          : 1;
        this.daftarStok.push(Object.assign({}, this.form, { id: newId }));
      }

      this.showModal = false;
    }
  }
});
