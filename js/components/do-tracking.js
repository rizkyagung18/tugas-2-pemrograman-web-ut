Vue.component('do-tracking', {
  template: '#tpl-tracking',

  props: {
    data: Array,
    paketList: Array
  },

  data: function() {
    return {
      cariInput: '',
      cariAktif: '',
      inputProgress: {}
    };
  },

  computed: {
    daftarFiltered: function() {
      if (!this.cariAktif) return this.data.slice().reverse();
      var q = this.cariAktif.toLowerCase();
      return this.data.filter(function(d) {
        return d.nomorDO.toLowerCase().includes(q) || d.nim.toLowerCase().includes(q);
      }).slice().reverse();
    }
  },

  watch: {
    cariInput: function(val) {
      if (!val) this.cariAktif = '';
    }
  },

  filters: {
    formatHarga: function(val) {
      return 'Rp ' + Number(val).toLocaleString('id-ID');
    }
  },

  methods: {
    cari: function() {
      this.cariAktif = this.cariInput;
    },

    handleKeySearch: function(e) {
      if (e.key === 'Enter') this.cari();
      if (e.key === 'Escape') {
        this.cariInput = '';
        this.cariAktif = '';
      }
    },

    tambahProgress: function(nomorDO) {
      var ket = this.inputProgress[nomorDO];
      if (!ket || !ket.trim()) return;
      this.$emit('tambah-progress', { nomorDO: nomorDO, keterangan: ket.trim() });
      this.$set(this.inputProgress, nomorDO, '');
    },

    handleEnterProgress: function(e, nomorDO) {
      if (e.key === 'Enter') this.tambahProgress(nomorDO);
    }
  }
});
