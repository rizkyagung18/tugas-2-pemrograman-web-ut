new Vue({
  el: '#app',

  data: {
    paketList: paket,

    daftarDO: [],

    form: {
      nim: '',
      nama: '',
      ekspedisi: '',
      kodePaket: '',
      tanggalKirim: new Date().toISOString().split('T')[0]
    },

    errors: {}
  },

  computed: {
    tahunBerjalan: function() {
      return new Date().getFullYear();
    },

    sequenceBerikut: function() {
      var n = this.daftarDO.length + 1;
      return String(n).padStart(3, '0');
    },

    nomorDO: function() {
      return 'DO' + this.tahunBerjalan + '-' + this.sequenceBerikut;
    },

    paketDipilih: function() {
      var kode = this.form.kodePaket;
      if (!kode) return null;
      return this.paketList.find(function(p) { return p.kodePaket === kode; }) || null;
    },

    totalHarga: function() {
      if (!this.paketDipilih) return 0;
      return this.paketDipilih.harga;
    },

    daftarDOUrut: function() {
      return this.daftarDO.slice().reverse();
    }
  },

  watch: {
    'form.kodePaket': function(val) {
      if (!val) return;
      var paketTerpilih = this.paketDipilih;
      if (paketTerpilih) {
        console.log('Paket dipilih:', paketTerpilih.namaPaket, '| Harga:', paketTerpilih.harga);
      }
    },

    'form.ekspedisi': function(val) {
      if (val === 'JNE Express') {
        console.log('Ekspedisi Express dipilih: estimasi pengiriman lebih cepat');
      }
    }
  },

  methods: {
    formatHarga: function(val) {
      return 'Rp ' + val.toLocaleString('id-ID');
    },

    validasi: function() {
      var err = {};
      if (!this.form.nim.trim()) err.nim = 'NIM tidak boleh kosong';
      if (!this.form.nama.trim()) err.nama = 'Nama tidak boleh kosong';
      if (!this.form.ekspedisi) err.ekspedisi = 'Pilih ekspedisi';
      if (!this.form.kodePaket) err.kodePaket = 'Pilih paket bahan ajar';
      if (!this.form.tanggalKirim) err.tanggalKirim = 'Tanggal kirim harus diisi';
      this.errors = err;
      return Object.keys(err).length === 0;
    },

    tambahDO: function() {
      if (!this.validasi()) return;

      var paketTerpilih = this.paketDipilih;

      this.daftarDO.push({
        nomorDO: this.nomorDO,
        nim: this.form.nim,
        nama: this.form.nama,
        ekspedisi: this.form.ekspedisi,
        kodePaket: paketTerpilih.kodePaket,
        namaPaket: paketTerpilih.namaPaket,
        isiPaket: paketTerpilih.isi.slice(),
        tanggalKirim: this.form.tanggalKirim,
        totalHarga: paketTerpilih.harga
      });

      this.form = {
        nim: '',
        nama: '',
        ekspedisi: '',
        kodePaket: '',
        tanggalKirim: new Date().toISOString().split('T')[0]
      };
      this.errors = {};
    }
  }
});
