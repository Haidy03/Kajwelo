// components/toast.js
export function showToast(message, type = "success") {
  const toastId = "global-toast";

  // Remove existing toast if any
  const existing = document.getElementById(toastId);
  if (existing) existing.remove();

  // Type-based styling
  let bgClass = "bg-success";
  if (type === "error") bgClass = "bg-danger";
  else if (type === "warning") bgClass = "bg-warning text-dark";

  const toastHTML = `
    <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 position-fixed bottom-0 end-0 m-4" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = toastHTML;
  document.body.appendChild(wrapper);

  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}
