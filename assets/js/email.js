// Para o formulário de contacto
document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.querySelector(".php-email-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Elementos do formulário
    const loadingDiv = contactForm.querySelector(".loading");
    const errorDiv = contactForm.querySelector(".error-message");
    const sentDiv = contactForm.querySelector(".sent-message");
    const submitBtn = contactForm.querySelector(".btn-submit");

    // Resetar mensagens
    if (loadingDiv) loadingDiv.style.display = "block";
    if (errorDiv) {
      errorDiv.style.display = "none";
      errorDiv.innerHTML = "";
    }
    if (sentDiv) sentDiv.style.display = "none";

    // Desabilitar botão
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = "0.6";
    }

    // Recolher dados do formulário
    const formData = new FormData(contactForm);

    // Enviar para o PHP
    fetch("api/email.php", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (loadingDiv) loadingDiv.style.display = "none";

        if (data.success) {
          // Mostrar mensagem de sucesso
          if (sentDiv) sentDiv.style.display = "block";
          contactForm.reset();

          // Esconder mensagem após 5 segundos
          setTimeout(() => {
            if (sentDiv) sentDiv.style.display = "none";
          }, 5000);

          // Reativar botão
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
          }
        } else {
          // Mostrar mensagem de erro
          if (errorDiv) {
            errorDiv.innerHTML =
              data.message || "Erro ao enviar mensagem. Tente novamente.";
            errorDiv.style.display = "block";
          }

          // Reativar botão
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
          }
        }
      })
      .catch((error) => {
        if (loadingDiv) loadingDiv.style.display = "none";
        if (errorDiv) {
          errorDiv.innerHTML =
            "Erro de conexão. Verifique sua internet e tente novamente.";
          errorDiv.style.display = "block";
        }

        // Reativar botão
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = "1";
        }
        console.error("Erro:", error);
      });
  });
});
