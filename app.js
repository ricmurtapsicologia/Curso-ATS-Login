(() => {
  "use strict";

  const LOGIN_CONFIG = Object.freeze({
    redirectUrl: "https://ricmurtapsicologia.github.io/Curso-ATS/",
    storageKey: "ats_login_attempts_v1",
    maxAttempts: 5,
    cooldownMs: 30_000,
    redirectDelayMs: 700,
    requiredDigits: 7
  });

  // Lista preservada integralmente da versão anterior.
  const RAW_REGISTRATIONS = Object.freeze([
    "1368646", "1359843", "1430750", "1605971", "1603687", "1613892", "1674993", "1075795", "1363845", "1550375",
    "1480128", "1479278", "1554559", "1525120", "1245661", "1549880", "1479088", "1524776", "1644525", "1788868",
    "terapiadoesquema", "5212651", "9104046", "1151258", "12597010", "1725936", "1728815", "1726678", "1728831",
    "1726033", "1636315", "1730340", "1729896", "1726157", "1727080", "1729581", "1638535", "1644772", "1645365",
    "1728708", "1729953", "1645092", "1638022", "1641349", "1728120", "1729458", "1726066", "1728054", "1639798",
    "1727049", "1727361", "1642388", "1727841", "1641000", "1605260", "1730084", "1365303", "1479666", "1311588",
    "1637024", "1822410", "1317288", "1644467", "1822899", "1640556", "05631415658", "1655562", "1525096", "1333681",
    "1644707", "1821719", "1365584", "1725829", "1635762", "1361757", "1479674", "1554138", "1641323", "1785906",
    "1766377", "1525427", "1317809", "7200064", "1722057", "1729334", "1636117", "1554880", "01188250620", "7488890",
    "1368687", "1644301", "1821669", "1554914", "1272707", "1317080", "1550615", "294424742", "07360928621",
    "professoraadriana", "1824275", "1786110", "1728849", "1727296", "1822418", "1789999", "1725886", "1824226",
    "1636364", "1729839", "1824259", "1786847", "1824234", "2428598", "1729961", "1824200", "1725993", "2139499",
    "1479666", "2240572", "1821826", "2428636", "1824358", "2414880", "2428547", "1824341", "2428610", "2428557",
    "1730126", "2428628", "2242010", "2428709", "2400570", "1824267", "1824242", "1482058", "1480607", "1481555",
    "1481506", "1317734", "1528124", "1479435", "1480478", "1530138", "1481775", "1497497", "1361047", "1480367",
    "1520653", "1481639", "1481290", "1481504", "1528298", "1480508", "1360270", "63198428149", "1527654", "1727312",
    "1550102", "1479476", "1549138", "1528819", "1481928", "1551241", "1555119", "1525534", "1554880", "1323351", "1482702",
    "1529395", "1551829", "1481035", "1479930", "1548650", "1551209", "1525476", "1524834", "1481258", "1361484"
  ]);

  const AUTHORIZED_REGISTRATIONS = new Set(
    RAW_REGISTRATIONS.map((registration) => String(registration))
  );

  const MESSAGE_ICONS = Object.freeze({
    error: '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z"/>',
    success: '<path fill="currentColor" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14-4-4 1.4-1.4L11 13.2l5.6-5.6L18 9l-7 7z"/>'
  });

  const dom = {
    form: document.getElementById("loginForm"),
    input: document.getElementById("matricula"),
    button: document.getElementById("btnAcessar"),
    buttonText: document.getElementById("buttonText"),
    message: document.getElementById("mensagem"),
    messageText: document.getElementById("msgText"),
    messageIcon: document.getElementById("msgIcon")
  };

  let countdownTimerId = null;

  const now = () => Date.now();

  function ready() {
    return Boolean(dom.form && dom.input && dom.button && dom.buttonText && dom.message && dom.messageText && dom.messageIcon);
  }

  function normalizeRegistration(value) {
    return String(value || "").replace(/\D+/g, "").slice(0, LOGIN_CONFIG.requiredDigits);
  }

  function defaultAttemptState() {
    return { count: 0, lockedUntil: 0 };
  }

  function loadAttemptState() {
    try {
      const raw = localStorage.getItem(LOGIN_CONFIG.storageKey);
      if (!raw) return defaultAttemptState();
      const parsed = JSON.parse(raw);
      return {
        count: Number(parsed.count || 0),
        lockedUntil: Number(parsed.lockedUntil || 0)
      };
    } catch {
      return defaultAttemptState();
    }
  }

  function saveAttemptState(state) {
    try {
      localStorage.setItem(
        LOGIN_CONFIG.storageKey,
        JSON.stringify({
          count: Number(state.count || 0),
          lockedUntil: Number(state.lockedUntil || 0)
        })
      );
    } catch {}
  }

  function clearAttemptState() {
    saveAttemptState(defaultAttemptState());
  }

  function setInvalid(invalid) {
    dom.input.setAttribute("aria-invalid", String(Boolean(invalid)));
  }

  function showMessage(text, tone = "error") {
    const safeTone = tone === "success" ? "success" : "error";
    dom.message.classList.add("is-visible");
    dom.message.dataset.tone = safeTone;
    dom.messageText.textContent = text;
    dom.messageIcon.innerHTML = MESSAGE_ICONS[safeTone];
    setInvalid(safeTone === "error");
  }

  function hideMessage() {
    dom.message.classList.remove("is-visible");
    dom.message.removeAttribute("data-tone");
    dom.messageText.textContent = "";
    setInvalid(false);
  }

  function focusInput() {
    if (!dom.input.disabled) dom.input.focus();
  }

  function remainingLockMs() {
    return Math.max(0, loadAttemptState().lockedUntil - now());
  }

  function setControlsLocked(locked) {
    dom.input.disabled = locked;
    dom.button.disabled = locked;
    dom.buttonText.textContent = locked ? "Aguarde" : "Entrar no ambiente";
  }

  function clearCountdownTimer() {
    if (countdownTimerId !== null) {
      window.clearInterval(countdownTimerId);
      countdownTimerId = null;
    }
  }

  function unlockControls() {
    clearCountdownTimer();
    clearAttemptState();
    setControlsLocked(false);
    hideMessage();
    focusInput();
  }

  function syncLockUI() {
    const remaining = remainingLockMs();
    if (remaining <= 0) {
      if (dom.input.disabled || dom.button.disabled) unlockControls();
      return false;
    }

    const seconds = Math.ceil(remaining / 1000);
    setControlsLocked(true);
    showMessage(`Muitas tentativas. Aguarde ${seconds}s antes de tentar novamente.`, "error");
    return true;
  }

  function startCountdownIfLocked() {
    clearCountdownTimer();
    if (!syncLockUI()) return;
    countdownTimerId = window.setInterval(() => {
      if (!syncLockUI()) unlockControls();
    }, 700);
  }

  function lockFor(ms) {
    saveAttemptState({ count: 0, lockedUntil: now() + Number(ms || 0) });
    startCountdownIfLocked();
  }

  function validateRegistration() {
    if (syncLockUI()) return;

    const registration = normalizeRegistration(dom.input.value);
    dom.input.value = registration;

    if (!registration) {
      showMessage("Informe sua matrícula para continuar.");
      focusInput();
      return;
    }

    if (registration.length !== LOGIN_CONFIG.requiredDigits) {
      showMessage("Matrícula incompleta. Digite os 7 números.");
      focusInput();
      return;
    }

    if (AUTHORIZED_REGISTRATIONS.has(registration)) {
      showMessage("Acesso autorizado. Abrindo o ambiente.", "success");
      clearAttemptState();
      setControlsLocked(true);
      dom.buttonText.textContent = "Acesso autorizado";

      window.setTimeout(() => {
        window.location.href = LOGIN_CONFIG.redirectUrl;
      }, LOGIN_CONFIG.redirectDelayMs);
      return;
    }

    const state = loadAttemptState();
    const nextCount = state.count + 1;
    const remainingAttempts = LOGIN_CONFIG.maxAttempts - nextCount;

    saveAttemptState({ count: nextCount, lockedUntil: 0 });

    if (nextCount >= LOGIN_CONFIG.maxAttempts) {
      lockFor(LOGIN_CONFIG.cooldownMs);
      return;
    }

    showMessage(
      `Matrícula não localizada. Verifique os números e tente novamente. (${remainingAttempts} tentativa(s) restante(s))`
    );
    focusInput();
  }

  function handleInput() {
    const normalized = normalizeRegistration(dom.input.value);
    if (dom.input.value !== normalized) dom.input.value = normalized;
    hideMessage();
  }

  function init() {
    if (!ready()) {
      console.error("Falha ao inicializar o acesso: elementos essenciais não encontrados.");
      return;
    }

    dom.form.addEventListener("submit", (event) => {
      event.preventDefault();
      validateRegistration();
    });

    dom.input.addEventListener("input", handleInput);
    startCountdownIfLocked();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
