document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const isPopup = body.classList.contains('popup-body');

  // =========================
  // 1) Flash message หายเอง
  // =========================
  const flashes = document.querySelectorAll('.flash');
  flashes.forEach((flash) => {
    setTimeout(() => {
      flash.classList.add('is-hiding');
      setTimeout(() => flash.remove(), 350);
    }, 4500);
  });

  // =========================
  // 2) Loading state ของปุ่ม submit
  // =========================
  
document.querySelectorAll('form').forEach((form) => {
  form.addEventListener('submit', () => {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (!submitBtn) return;

    // ถ้าเป็น form ที่ใช้ confirm modal ให้รอจนกดยืนยันจริงก่อน
    if (form.hasAttribute('data-confirm-modal')) return;

    submitBtn.dataset.originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '⏳ กำลังบันทึก...';
  });
});

  // popup page mode
  if (isPopup) {
    document.addEventListener('click', function (event) {
      const trigger = event.target.closest('[data-popup-close]');
      if (!trigger) return;
      event.preventDefault();

      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'hlis-popup-done' }, window.location.origin);
      }
    });
    return;
  }

  // main page mode
  const confirmModal = document.getElementById('confirm-modal');
  const confirmTitle = document.getElementById('confirm-modal-title');
  const confirmMessage = document.getElementById('confirm-modal-message');
  const confirmCancel = document.getElementById('confirm-modal-cancel');
  const confirmSubmit = document.getElementById('confirm-modal-submit');

  const pageModal = document.getElementById('page-modal');
  const pageFrame = document.getElementById('page-modal-frame');
  const pageTitle = document.getElementById('page-modal-title');
  const pageClose = document.getElementById('page-modal-close');

  let pendingForm = null;

  function withPopupParam(url) {
    const parsed = new URL(url, window.location.origin);
    parsed.searchParams.set('popup', '1');
    return parsed.toString();
  }

  function openConfirmModal(form) {
    pendingForm = form;
    confirmTitle.textContent = form.dataset.confirmTitle || 'ยืนยันการลบ';
    confirmMessage.textContent = form.dataset.confirmMessage || 'ต้องการดำเนินการต่อใช่หรือไม่?';
    confirmSubmit.textContent = form.dataset.confirmButton || 'ยืนยัน';
    confirmModal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closeConfirmModal() {
    confirmModal.hidden = true;
    pendingForm = null;
    if (pageModal.hidden) {
      document.body.classList.remove('modal-open');
    }
  }

  function openPageModal(url, text) {
    pageTitle.textContent = text || 'รายละเอียด';
    pageFrame.src = withPopupParam(url);
    pageModal.hidden = false;
    document.body.classList.add('modal-open');
  }

  function closePageModal(options = {}) {
    pageModal.hidden = true;
    pageFrame.src = 'about:blank';
    document.body.classList.remove('modal-open');

    if (options.parentUrl) {
      window.location.assign(options.parentUrl);
      return;
    }

    if (options.refreshParent) {
      window.location.reload();
    }
  }

  if (pageClose) {
    pageClose.addEventListener('click', () => closePageModal());
  }

  if (confirmCancel) {
    confirmCancel.addEventListener('click', () => closeConfirmModal());
  }

  if (confirmSubmit) {
  confirmSubmit.addEventListener('click', () => {
    const form = pendingForm;
    closeConfirmModal();
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.dataset.originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '⏳ กำลังดำเนินการ...';
    }

    HTMLFormElement.prototype.submit.call(form);
  });
}

  if (confirmModal) {
    confirmModal.addEventListener('click', (event) => {
      if (event.target === confirmModal) closeConfirmModal();
    });
  }

  if (pageModal) {
    pageModal.addEventListener('click', (event) => {
      if (event.target === pageModal) closePageModal();
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (confirmModal && !confirmModal.hidden) closeConfirmModal();
    else if (pageModal && !pageModal.hidden) closePageModal();
  });

  // เปิด modal page
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('a[data-page-modal]');
    if (!trigger) return;
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    openPageModal(trigger.href, trigger.dataset.modalTitle || trigger.textContent.trim());
  });

  // confirm modal
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement) || !form.hasAttribute('data-confirm-modal')) return;
    event.preventDefault();
    openConfirmModal(form);
  });

  // popup done
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) return;
    if (!event.data || event.data.type !== 'hlis-popup-done') return;

    closePageModal({
      refreshParent: !!event.data.refreshParent,
      parentUrl: event.data.parentUrl || null
    });
  });
});