Vue.component('ba-stock-table', {
  template: '#tpl-stock',

  props: {
    items: Array,
    upbjjList: Array,
    kategoriList: Array
  },

  data: function() {
    return {
      filterUpbjj: '',
      filterKategori: '',
      filterStok: '',
      sortBy: '',
      sortDir: 'asc',

      showForm: false,
      modeEdit: false,
      editId: null,

      showKonfirmasi: false,
      hapusId: null,

      form: this.formKosong(),
      errors: {}
    };
  },

  computed: {
    dataFiltered: function() {
      var vm = this;
      var hasil = this.items.filter(function(item) {
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
          if (typeof a[key] === 'string') return dir * a[key].localeCompare(b[key]);
          return dir * (a[key] - b[key]);
        });
      }

      return hasil;
    }
  },

  watch: {
    filterUpbjj: function(val) {
      if (!val) this.filterKategori = '';
    },
    filterStok: function(val) {
      if (val === 'kosong') {
        this.sortBy = 'judul';
        this.sortDir = 'asc';
      }
    }
  },

  filters: {
    formatHarga: function(val) {
      return 'Rp ' + Number(val).toLocaleString('id-ID');
    },
    formatQty: function(val) {
      return val + ' buah';
    }
  },

  methods: {
    formKosong: function() {
      return { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', qty: 0, safety: 0, harga: 0, catatanHTML: '' };
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

    bukaFormTambah: function() {
      this.modeEdit = false;
      this.editId = null;
      this.form = this.formKosong();
      this.errors = {};
      this.showForm = true;
    },

    bukaFormEdit: function(item) {
      this.modeEdit = true;
      this.editId = item.id;
      this.form = Object.assign({}, item);
      this.errors = {};
      this.showForm = true;
    },

    konfirmasiHapus: function(id) {
      this.hapusId = id;
      this.showKonfirmasi = true;
    },

    hapus: function() {
      this.$emit('hapus', this.hapusId);
      this.showKonfirmasi = false;
      this.hapusId = null;
    },

    validasi: function() {
      var err = {};
      if (!this.form.kode.trim()) err.kode = 'Wajib diisi';
      if (!this.form.judul.trim()) err.judul = 'Wajib diisi';
      if (!this.form.kategori) err.kategori = 'Wajib dipilih';
      if (!this.form.upbjj) err.upbjj = 'Wajib dipilih';
      if (!this.form.lokasiRak.trim()) err.lokasiRak = 'Wajib diisi';
      if (this.form.qty < 0) err.qty = 'Tidak boleh negatif';
      if (this.form.safety < 0) err.safety = 'Tidak boleh negatif';
      if (this.form.harga <= 0) err.harga = 'Harus lebih dari 0';
      this.errors = err;
      return Object.keys(err).length === 0;
    },

    simpan: function() {
      if (!this.validasi()) return;
      if (this.modeEdit) {
        this.$emit('update', Object.assign({}, this.form, { id: this.editId }));
      } else {
        this.$emit('tambah', Object.assign({}, this.form));
      }
      this.showForm = false;
    },

    handleEnter: function() {
      this.simpan();
    }
  }
});
