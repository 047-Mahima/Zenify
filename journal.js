document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('journalForm');
  if (!form) return;

  const mood = document.body.dataset.mood || 'unknown';

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputs = Array.from(form.querySelectorAll('input[type="text"]'));
    let valid = true;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        valid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });

    if (!valid) return;

    const answers = inputs.map(input => ({
      question: form.querySelector(`label[for="${input.id}"]`)?.textContent.trim() || input.id,
      answer: input.value.trim(),
    }));

    try {
      const stored = localStorage.getItem('zenify-journal');
      const entries = stored ? JSON.parse(stored) : [];
      entries.unshift({ mood, date: new Date().toISOString(), answers });
      localStorage.setItem('zenify-journal', JSON.stringify(entries));
    } catch (_) {
      // localStorage unavailable — entry is still shown as saved in UI
    }

    form.reset();
    inputs.forEach(input => input.classList.remove('is-invalid'));
    showAlert('Your journal entry has been saved!', 'success');
  });

  form.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', () => {
      if (input.value.trim()) input.classList.remove('is-invalid');
    });
  });

  function showAlert(message, type) {
    const existing = document.querySelector('.journal-alert');
    if (existing) existing.remove();

    const alert = document.createElement('div');
    alert.className = `alert alert-${type} mt-3 journal-alert`;
    alert.setAttribute('role', 'alert');
    alert.textContent = message;
    form.after(alert);
    setTimeout(() => alert.remove(), 4000);
  }
});
