
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  loginMessage.textContent = "Verificando acesso...";

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password: senha
  });

  if (error) {
    loginMessage.textContent = "E-mail ou senha inválidos.";
    return;
  }

  window.location.href = "admin.html";
});
