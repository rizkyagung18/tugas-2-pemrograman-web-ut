Vue.component('status-badge', {
  template: '#tpl-badge',
  props: {
    qty: Number,
    safety: Number,
    catatan: String
  },
  computed: {
    statusClass: function() {
      if (this.qty === 0) return 'status-kosong';
      if (this.qty < this.safety) return 'status-menipis';
      return 'status-aman';
    },
    statusTeks: function() {
      if (this.qty === 0) return '[!] Kosong';
      if (this.qty < this.safety) return '[~] Menipis';
      return '[v] Aman';
    }
  }
});
