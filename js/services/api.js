var ApiService = {
  loadData: function() {
    return fetch('./data/dataBahanAjar.json')
      .then(function(res) { return res.json(); });
  }
};
