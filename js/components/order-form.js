Vue.component('order-form', {
  template: '#tpl-order',

  props: {
    paketList: Array,
    jumlahDO: Number
  },

  data: function() {
    return {
      form: {
        nim: '',
        nama: '',
        ekspedisi: '',
        kodePaket: '',
        tanggalKirim: new Date().toISOString().split('T')[0]
      },
      errors: {}
    };
  },

  computed: {
    tahun: function() {
      return new Date().getFullYear();
    },

    nomorDO: function() {
      var seq = String(this.jumlahDO + 1).padStart(3, '0');
      return 'DO' + this.tahun + '-' + seq;
    },

    paketDipilih: function() {
      var kode = this.form.kodePaket;
      if (!kode) return null;
      return this.paketList.find(function(p) { return p.kodePaket === kode; }) || null;
    }
  },

  watch: {
    'form.kodePaket': function(val) {
      if (val && this.paketDipilih) {
        console.log('Paket dipilih:', this.paketDipilih.namaPaket);
      }
    },
    'form.ekspedisi': function(val) {
      if (val) {
        console.log('Ekspedisi:', val);
      }
    }
  },

  filters: {
    formatHarga: function(val) {
      return 'Rp ' + Number(val).toLocaleString('id-ID');
    },
    formatTanggal: function(val) {
      if (!val) return '';
      var bulan = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      var d = new Date(val);
      return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear();
    }
  },

  methods: {
    validasi: function() {
      var err = {};
      if (!this.form.nim.trim()) err.nim = 'Wajib diisi';
      if (!this.form.nama.trim()) err.nama = 'Wajib diisi';
      if (!this.form.ekspedisi) err.ekspedisi = 'Wajib dipilih';
      if (!this.form.kodePaket) err.kodePaket = 'Wajib dipilih';
      if (!this.form.tanggalKirim) err.tanggalKirim = 'Wajib diisi';
      this.errors = err;
      return Object.keys(err).length === 0;
    },

    simpan: function() {
      if (!this.validasi()) return;
      var paket = this.paketDipilih;
      this.$emit('created', {
        nomorDO: this.nomorDO,
        nim: this.form.nim,
        nama: this.form.nama,
        ekspedisi: this.form.ekspedisi,
        kodePaket: paket.kodePaket,
        namaPaket: paket.namaPaket,
        isiPaket: paket.isi.slice(),
        tanggalKirim: this.form.tanggalKirim,
        totalHarga: paket.harga,
        progress: []
      });
      this.form = {
        nim: '', nama: '', ekspedisi: '', kodePaket: '',
        tanggalKirim: new Date().toISOString().split('T')[0]
      };
      this.errors = {};
    },

    handleEnter: function() {
      this.simpan();
    }
  }
});
