export const normalizeEmail = (e: string) => e.trim().toLowerCase();

export const isValidEmail = (e: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

export const isStrongPassword = (p: string) => {
  // min 8, 1 maiúscula, 1 minúscula, 1 número (sem chars proibidos)
  if (p.length < 8) return false;
  const hasUpper = /[A-Z]/.test(p);
  const hasLower = /[a-z]/.test(p);
  const hasNum = /\d/.test(p);
  const hasSpace = /\s/.test(p);
  return hasUpper && hasLower && hasNum && !hasSpace;
};

export const clampLen = (s: string, max = 128) =>
  s.length > max ? s.slice(0, max) : s;

export const friendlyAuthError = (code?: string) => {
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
    case "auth/user-not-found":
      return "E-mail ou senha inválidos."; // genérico (anti enumeração)
    case "auth/too-many-requests":
      return "Muitas tentativas. Tente novamente em instantes.";
    case "auth/network-request-failed":
      return "Falha de rede. Verifique sua conexão.";
    case "auth/email-already-in-use":
      return "Não foi possível concluir. Tente outro e-mail."; // genérico
    case "auth/invalid-email":
      return "E-mail inválido.";
    default:
      return "Não foi possível concluir. Tente novamente.";
  }
};
