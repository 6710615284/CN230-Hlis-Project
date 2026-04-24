document.addEventListener('DOMContentLoaded', () => {
  const checkboxes = document.querySelectorAll('input[name="test_ids"]');
  const totalEl = document.getElementById('total-price');
  const summaryEl = document.getElementById('summary');
  const countEl = document.getElementById('selected-count');
  const priorityEl = document.getElementById('selected-priority');
  const prioritySelect = document.getElementById('prioritySelect');
  const submitBtn = document.getElementById('orderSubmitBtn');

  if (!checkboxes.length || !totalEl || !summaryEl || !countEl || !priorityEl || !prioritySelect || !submitBtn) return;

  function updateSummary() {
    let total = 0;
    let count = 0;

    checkboxes.forEach((cb) => {
      if (!cb.checked) return;
      count++;
      const priceEl = cb.closest('.test-item').querySelector('.test-price');
      total += parseFloat(priceEl.dataset.price || 0);
    });

    countEl.textContent = count;
    totalEl.textContent = '฿' + total.toLocaleString();
    priorityEl.textContent = prioritySelect.value === 'urgent' ? 'Urgent' : 'Routine';
    summaryEl.style.display = count ? 'block' : 'none';
    submitBtn.disabled = count === 0;
  }

  checkboxes.forEach(cb => cb.addEventListener('change', updateSummary));
  prioritySelect.addEventListener('change', updateSummary);

  updateSummary();
});