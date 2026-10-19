(function () {
  document.addEventListener('change', function (event) {
    if (event.target.id !== 'fabric-category') return;
    var selected = event.target.value;
    var visible = 0;
    document.querySelectorAll('#fabric-products .samruddhi-fabric-card').forEach(function (card) {
      var category = card.querySelector('span').textContent.trim();
      var matches = selected === 'all' || category === selected;
      card.hidden = !matches;
      if (matches) visible++;
    });
    document.getElementById('fabric-product-count').textContent = visible + (visible === 1 ? ' product' : ' products');
  });
})();
