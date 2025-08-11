export function showModal(message, type = "info", title = "Notice") {
  const modalTitle = document.getElementById("globalModalTitle");
  const modalBody = document.getElementById("globalModalBodyText");
  const modalHeader = document.getElementById("globalModalHeader");
  const modalIcon = document.getElementById("globalModalIcon");

  // 🧠 نوع الرسالة (class + icon)
  let config = {
    success: { class: "text-success", icon: "✅" },
    error: { class: "text-danger", icon: "❌" },
    warning: { class: "text-warning", icon: "⚠️" },
    info: { class: "text-primary", icon: "ℹ️" }
  };

  const { class: textClass, icon } = config[type] || config.info;

  // 🖌️ تحديث المحتوى والشكل
  modalTitle.innerHTML = `${icon} ${title}`;
  modalBody.innerText = message;

  // 🧼 نظف الهيدر من أي classes قديمة
  modalHeader.className = "modal-header " + textClass;

  // 🧠 إظهار المودال
  const modal = new bootstrap.Modal(document.getElementById("globalModal"));
  modal.show();
}
