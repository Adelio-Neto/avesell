// form.js - Código completo e corrigido

let currentStep = 1;

function goStep(step) {
  // Validar campos do passo 1 antes de avançar
  if (step === 2 && !validateStep1()) {
    return;
  }

  document.getElementById(`step${currentStep}`).classList.remove("active");
  currentStep = step;
  document.getElementById(`step${currentStep}`).classList.add("active");

  for (let i = 1; i <= 2; i++) {
    const bar = document.getElementById(`bar${i}`);
    bar.classList.remove("active", "done");
    if (i < step) bar.classList.add("done");
    else if (i === step) bar.classList.add("active");
  }
}

function togglePassword(id, btn) {
  const input = document.getElementById(id);
  const icon = btn.querySelector("i");
  if (input.type === "password") {
    input.type = "text";
    icon.className = "bi bi-eye-slash";
  } else {
    input.type = "password";
    icon.className = "bi bi-eye";
  }
}

// ========== VALIDAÇÃO DO PASSO 1 ==========
function validateStep1() {
  const company = document.getElementById("company").value.trim();
  const nif = document.getElementById("nif").value.trim();
  const sector = document.getElementById("sector").value;
  const country = document.getElementById("country").value;
  const phone = document.getElementById("phone").value.trim();

  let isValid = true;
  let errorMessage = "";

  if (!company) {
    errorMessage += "• Nome da Empresa é obrigatório\n";
    isValid = false;
    showFieldError("company", "Nome da empresa é obrigatório");
  } else if (company.length < 3) {
    errorMessage += "• Nome da Empresa deve ter pelo menos 3 caracteres\n";
    isValid = false;
    showFieldError("company", "Mínimo 3 caracteres");
  } else {
    clearFieldError("company");
  }

  if (!nif) {
    errorMessage += "• NIF/NIPC é obrigatório\n";
    isValid = false;
    showFieldError("nif", "NIF é obrigatório");
  } else if (!validateNIF(nif)) {
    errorMessage +=
      "• NIF/NIPC inválido. Use formato: 000.000.000 ou 000000000\n";
    isValid = false;
    showFieldError("nif", "Formato inválido");
  } else {
    clearFieldError("nif");
  }

  if (!sector) {
    errorMessage += "• Categoria da Loja é obrigatória\n";
    isValid = false;
    showFieldError("sector", "Selecione uma categoria");
  } else {
    clearFieldError("sector");
  }

  if (!country) {
    errorMessage += "• País é obrigatório\n";
    isValid = false;
    showFieldError("country", "Selecione um país");
  } else {
    clearFieldError("country");
  }

  if (!phone) {
    errorMessage += "• Telefone de Contacto é obrigatório\n";
    isValid = false;
    showFieldError("phone", "Telefone é obrigatório");
  } else if (!validatePhone(phone)) {
    errorMessage += "• Telefone inválido. Use formato: +244 900 000 000\n";
    isValid = false;
    showFieldError("phone", "Formato inválido");
  } else {
    clearFieldError("phone");
  }

  if (!isValid) {
    alert(
      "Por favor, corrija os seguintes erros no passo 1:\n\n" + errorMessage,
    );
    return false;
  }

  return true;
}

// ========== VALIDAÇÃO DO PASSO 2 ==========
function validateStep2() {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const terms = document.getElementById("terms").checked;

  let isValid = true;
  let errorMessage = "";

  if (!firstName) {
    errorMessage += "• Nome é obrigatório\n";
    isValid = false;
    showFieldError("firstName", "Nome é obrigatório");
  } else if (firstName.length < 2) {
    errorMessage += "• Nome deve ter pelo menos 2 caracteres\n";
    isValid = false;
    showFieldError("firstName", "Mínimo 2 caracteres");
  } else {
    clearFieldError("firstName");
  }

  if (!lastName) {
    errorMessage += "• Apelido é obrigatório\n";
    isValid = false;
    showFieldError("lastName", "Apelido é obrigatório");
  } else if (lastName.length < 2) {
    errorMessage += "• Apelido deve ter pelo menos 2 caracteres\n";
    isValid = false;
    showFieldError("lastName", "Mínimo 2 caracteres");
  } else {
    clearFieldError("lastName");
  }

  if (!email) {
    errorMessage += "• Email é obrigatório\n";
    isValid = false;
    showFieldError("regEmail", "Email é obrigatório");
  } else if (!validateEmail(email)) {
    errorMessage += "• Email inválido. Exemplo: nome@empresa.com\n";
    isValid = false;
    showFieldError("regEmail", "Email inválido");
  } else {
    clearFieldError("regEmail");
  }

  if (!password) {
    errorMessage += "• Password é obrigatória\n";
    isValid = false;
    showFieldError("regPassword", "Password é obrigatória");
  } else if (password.length < 8) {
    errorMessage += "• Password deve ter pelo menos 8 caracteres\n";
    isValid = false;
    showFieldError("regPassword", "Mínimo 8 caracteres");
  } else if (!validatePasswordStrength(password)) {
    errorMessage +=
      "• Password deve conter letras maiúsculas, minúsculas, números e caracteres especiais\n";
    isValid = false;
    showFieldError("regPassword", "Senha muito fraca");
  } else {
    clearFieldError("regPassword");
  }

  if (!confirmPassword) {
    errorMessage += "• Confirmar Password é obrigatório\n";
    isValid = false;
    showFieldError("confirmPassword", "Confirme sua senha");
  } else if (password !== confirmPassword) {
    errorMessage += "• As passwords não coincidem\n";
    isValid = false;
    showFieldError("confirmPassword", "Senhas não coincidem");
  } else {
    clearFieldError("confirmPassword");
  }

  if (!terms) {
    errorMessage +=
      "• Você deve aceitar os Termos de Serviço e Política de Privacidade\n";
    isValid = false;
  }

  if (!isValid) {
    alert(
      "Por favor, corrija os seguintes erros no passo 2:\n\n" + errorMessage,
    );
    return false;
  }

  return true;
}

// ========== FUNÇÕES DE VALIDAÇÃO AUXILIARES ==========
function validateNIF(nif) {
  const cleanNIF = nif.replace(/[.\s]/g, "");
  return /^\d{9}$/.test(cleanNIF);
}

function validatePhone(phone) {
  const cleanPhone = phone.replace(/[\s\(\)\-]/g, "");
  return /^(\+\d{1,3})?\d{9}$/.test(cleanPhone);
}

function validateEmail(email) {
  const re = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
  return re.test(email);
}

function validatePasswordStrength(password) {
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const strength = [
    hasUpperCase,
    hasLowerCase,
    hasNumbers,
    hasSpecialChar,
  ].filter(Boolean).length;
  return strength >= 3;
}

function showFieldError(fieldId, message) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  clearFieldError(fieldId);
  field.classList.add("error");

  const errorSpan = document.createElement("span");
  errorSpan.className = "field-error";
  errorSpan.style.color = "#ef4444";
  errorSpan.style.fontSize = "12px";
  errorSpan.style.marginTop = "4px";
  errorSpan.style.display = "block";
  errorSpan.textContent = message;

  const inputWrap = field.closest(".input-wrap");
  if (inputWrap) {
    inputWrap.parentNode.insertBefore(errorSpan, inputWrap.nextSibling);
  } else {
    field.parentNode.appendChild(errorSpan);
  }
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  if (!field) return;

  field.classList.remove("error");

  const errorSpan = field.parentNode.parentNode.querySelector(".field-error");
  if (errorSpan) {
    errorSpan.remove();
  }
}

// Força da password
document.addEventListener("DOMContentLoaded", function () {
  const passwordInput = document.getElementById("regPassword");
  if (passwordInput) {
    passwordInput.addEventListener("input", function () {
      const val = this.value;
      const fill = document.getElementById("strengthFill");
      const label = document.getElementById("strengthLabel");

      if (!fill || !label) return;

      if (!val) {
        fill.style.width = "0%";
        fill.style.background = "transparent";
        label.textContent = "";
        return;
      }

      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;

      const map = [
        { w: "0%", bg: "transparent", txt: "", color: "#666" },
        { w: "25%", bg: "#ef4444", txt: "Fraca", color: "#ef4444" },
        { w: "55%", bg: "#f59e0b", txt: "Razoável", color: "#f59e0b" },
        { w: "80%", bg: "#3b82f6", txt: "Boa", color: "#3b82f6" },
        { w: "100%", bg: "#10b981", txt: "Excelente", color: "#10b981" },
      ];
      fill.style.width = map[strength].w;
      fill.style.background = map[strength].bg;
      label.textContent = map[strength].txt;
      label.style.color = map[strength].color;
    });
  }

  // Validar confirmação de senha em tempo real
  const confirmInput = document.getElementById("confirmPassword");
  if (confirmInput) {
    confirmInput.addEventListener("input", function () {
      const password = document.getElementById("regPassword").value;
      const confirm = this.value;

      if (confirm && password !== confirm) {
        showFieldError("confirmPassword", "As senhas não coincidem");
      } else {
        clearFieldError("confirmPassword");
      }
    });
  }

  // Validar email em tempo real
  const emailInput = document.getElementById("regEmail");
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const email = this.value.trim();
      if (email && !validateEmail(email)) {
        showFieldError("regEmail", "Email inválido");
      } else {
        clearFieldError("regEmail");
      }
    });
  }

  // Validar NIF em tempo real
  const nifInput = document.getElementById("nif");
  if (nifInput) {
    nifInput.addEventListener("blur", function () {
      const nif = this.value.trim();
      if (nif && !validateNIF(nif)) {
        showFieldError("nif", "NIF inválido. Use 9 dígitos");
      } else {
        clearFieldError("nif");
      }
    });
  }

  // Validar telefone em tempo real
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("blur", function () {
      const phone = this.value.trim();
      if (phone && !validatePhone(phone)) {
        showFieldError("phone", "Telefone inválido");
      } else {
        clearFieldError("phone");
      }
    });
  }
});

// Função para enviar os dados
function sendRegistrationData(formData) {
  const submitBtn = document.querySelector('.btn-next[type="submit"]');
  if (!submitBtn) return;

  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> A enviar...';
  submitBtn.disabled = true;

  fetch("api/contact.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("✅ " + data.message);
        document.getElementById("registerForm").reset();
        goStep(1);
        const strengthFill = document.getElementById("strengthFill");
        const strengthLabel = document.getElementById("strengthLabel");
        if (strengthFill) strengthFill.style.width = "0%";
        if (strengthLabel) strengthLabel.textContent = "";
      } else {
        alert("❌ Erro: " + data.message);
      }
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    })
    .catch((error) => {
      console.error("Erro:", error);
      alert("❌ Erro de conexão. Tente novamente.");
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    });
}

// Submit do formulário
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registerForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!validateStep2()) {
        return;
      }

      const formData = {
        company: document.getElementById("company").value.trim(),
        nif: document.getElementById("nif").value.trim(),
        sector: document.getElementById("sector").value,
        country: document.getElementById("country").value,
        phone: document.getElementById("phone").value.trim(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("regEmail").value.trim(),
        role: document.getElementById("role").value || "Não informado",
        password: document.getElementById("regPassword").value,
      };

      sendRegistrationData(formData);
    });
  }
});

// Adicionar CSS para campos com erro
const style = document.createElement("style");
style.textContent = `
  .form-input.error {
    border-color: #ef4444 !important;
    background-color: #fff5f5 !important;
  }
  .field-error {
    animation: fadeIn 0.3s ease;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
