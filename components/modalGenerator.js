// components/modalGenerator.js

export function generateModal(id, title, bodyHTML, footerHTML = "", showImmediately = true) {
  // Remove existing modal with same ID
  const existingModal = document.getElementById(id);
  if (existingModal) existingModal.remove();

  const modalHTML = `
  <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="${id}Label" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="${id}Label">${title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          ${bodyHTML}
        </div>
        <div class="modal-footer">
          ${footerHTML}
        </div>
      </div>
    </div>
  </div>
  `;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = modalHTML;
  document.body.appendChild(wrapper);

  if (showImmediately) {
    const modal = new bootstrap.Modal(document.getElementById(id));
    modal.show();
  }
}
