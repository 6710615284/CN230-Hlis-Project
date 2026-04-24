document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('testtypeTable');
  const searchInput = document.getElementById('testtypeSearch');
  const sortSelect = document.getElementById('testtypeSort');

  if (!table || !searchInput || !sortSelect) return;

  const tbody = table.querySelector('tbody');
  const originalRows = Array.from(tbody.querySelectorAll('tr'));

  function renderRows() {
    let rows = [...originalRows];
    const keyword = searchInput.value.trim().toLowerCase();

    if (keyword) {
      rows = rows.filter(row => row.innerText.toLowerCase().includes(keyword));
    }

    const sortValue = sortSelect.value;

    if (sortValue === 'price-asc') {
      rows.sort((a, b) => Number(a.dataset.price || 0) - Number(b.dataset.price || 0));
    } else if (sortValue === 'price-desc') {
      rows.sort((a, b) => Number(b.dataset.price || 0) - Number(a.dataset.price || 0));
    } else if (sortValue === 'name-asc') {
      rows.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    }

    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
  }

  searchInput.addEventListener('input', renderRows);
  sortSelect.addEventListener('change', renderRows);
});