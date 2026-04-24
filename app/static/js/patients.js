document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('patientSearch');
  const table = document.getElementById('patientTable');
  if (!input || !table) return;

  const rows = table.querySelectorAll('tbody tr');

  input.addEventListener('input', () => {
    const keyword = input.value.trim().toLowerCase();

    rows.forEach((row) => {
      const text = row.innerText.toLowerCase();
      row.style.display = text.includes(keyword) ? '' : 'none';
    });
  });
});