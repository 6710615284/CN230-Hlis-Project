document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('staffSearch');
  const table = document.getElementById('staffTable');

  if (input && table) {
    const rows = table.querySelectorAll('tbody tr');

    input.addEventListener('input', () => {
      const keyword = input.value.trim().toLowerCase();

      rows.forEach((row) => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(keyword) ? '' : 'none';
      });
    });
  }

  const pwModal = document.getElementById('pw-modal');
  const pwForm = document.getElementById('pw-form');
  const pwInput = document.getElementById('pw-input');

  function openPwModal(staffId) {
    if (!pwModal || !pwForm || !pwInput) return;

    pwForm.action = '/admin/staff/reset-pw/' + staffId;
    pwInput.value = '';
    pwModal.style.display = 'flex';
    pwInput.focus();
  }

  function closePwModal() {
    if (!pwModal) return;
    pwModal.style.display = 'none';
  }

  document.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-open-pw-modal]');
    if (btn) {
      openPwModal(btn.dataset.staffId);
      return;
    }

    if (event.target === pwModal) {
      closePwModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePwModal();
    }
  });

  window.closePwModal = closePwModal;
});