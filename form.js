const ENDPOINT = 'https://smart-empreender-lab.true-lark-5834.chatgpt.site/api/register';
const form = document.getElementById('registration');
const email = document.getElementById('email');
const confirmation = document.getElementById('emailConfirmation');
const error = document.getElementById('confirmation-error');
const status = document.getElementById('status');
const button = document.getElementById('submit');
const normalize = value => value.trim().toLowerCase();
function checkEmails(show = false) {
  const mismatch = confirmation.value !== '' && normalize(email.value) !== normalize(confirmation.value);
  confirmation.setCustomValidity(mismatch ? 'Os e-mails precisam ser iguais. Confira os dois campos.' : '');
  confirmation.setAttribute('aria-invalid', String(mismatch && show));
  error.textContent = mismatch && show ? 'Os e-mails estão diferentes. Confira os dois campos.' : '';
  return !mismatch;
}
email.addEventListener('input', () => checkEmails());
confirmation.addEventListener('input', () => checkEmails());
confirmation.addEventListener('blur', () => checkEmails(true));
confirmation.addEventListener('invalid', () => checkEmails(true));
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (button.disabled) return;
  email.value = normalize(email.value);
  confirmation.value = normalize(confirmation.value);
  if (!checkEmails(true) || !form.reportValidity()) return;
  const data = Object.fromEntries(new FormData(form));
  status.textContent = '';
  button.disabled = true;
  button.textContent = 'Enviando cadastro…';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: controller.signal });
    const result = await response.json();
    if (!response.ok || !result.ok) throw new Error(result.error || 'Não foi possível confirmar seu cadastro. Tente novamente.');
    document.getElementById('saved-email').textContent = email.value;
    form.hidden = true;
    document.querySelector('.intro').hidden = true;
    document.getElementById('success').hidden = false;
    document.getElementById('success').focus();
  } catch (err) {
    status.textContent = err.name === 'AbortError' ? 'A confirmação demorou. Tente enviar novamente; seu cadastro não será duplicado.' : err instanceof TypeError ? 'Não foi possível conectar. Confira sua internet e tente novamente.' : err.message;
  } finally {
    clearTimeout(timeout);
    button.disabled = false;
    button.textContent = 'Cadastrar para receber acesso ↗';
  }
});
document.getElementById('another').addEventListener('click', () => {
  form.reset(); checkEmails(); status.textContent = '';
  document.getElementById('success').hidden = true;
  document.querySelector('.intro').hidden = false;
  form.hidden = false;
  document.getElementById('name').focus();
});
