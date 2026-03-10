// Pure validation functions — no framework imports, fully portable.

export interface FieldError {
  field: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return "Email is required.";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  return null;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | null {
  if (!confirmPassword) return "Please confirm your password.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return null;
}

export function validateDisplayName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Display name is required.";
  if (trimmed.length < 2) return "Display name must be at least 2 characters.";
  if (trimmed.length > 50) return "Display name must be 50 characters or fewer.";
  return null;
}

export type PasswordStrength = "weak" | "medium" | "strong";

export function getPasswordStrength(password: string): PasswordStrength {
  if (password.length < 8) return "weak";

  let variety = 0;
  if (/[a-z]/.test(password)) variety++;
  if (/[A-Z]/.test(password)) variety++;
  if (/[0-9]/.test(password)) variety++;
  if (/[^a-zA-Z0-9]/.test(password)) variety++;

  if (password.length >= 12 && variety >= 3) return "strong";
  if (password.length >= 8 && variety >= 2) return "medium";
  return "weak";
}

export function validateLoginForm(email: string, password: string): FieldError[] {
  const errors: FieldError[] = [];
  const emailErr = validateEmail(email);
  if (emailErr) errors.push({ field: "email", message: emailErr });
  if (!password) errors.push({ field: "password", message: "Password is required." });
  return errors;
}

export function validateSignupForm(
  displayName: string,
  email: string,
  password: string,
  confirmPassword: string
): FieldError[] {
  const errors: FieldError[] = [];

  const nameErr = validateDisplayName(displayName);
  if (nameErr) errors.push({ field: "displayName", message: nameErr });

  const emailErr = validateEmail(email);
  if (emailErr) errors.push({ field: "email", message: emailErr });

  const passErr = validatePassword(password);
  if (passErr) errors.push({ field: "password", message: passErr });

  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (confirmErr) errors.push({ field: "confirmPassword", message: confirmErr });

  return errors;
}

export function validateResetPasswordForm(
  password: string,
  confirmPassword: string
): FieldError[] {
  const errors: FieldError[] = [];

  const passErr = validatePassword(password);
  if (passErr) errors.push({ field: "password", message: passErr });

  const confirmErr = validateConfirmPassword(password, confirmPassword);
  if (confirmErr) errors.push({ field: "confirmPassword", message: confirmErr });

  return errors;
}

/**
 * Maps Supabase auth error messages to user-friendly messages.
 */
export function mapAuthError(
  error: string,
  context: "login" | "signup" | "oauth" | "reset"
): string {
  const lower = error.toLowerCase();

  // Rate limiting
  if (lower.includes("rate") || lower.includes("too many")) {
    return "Too many attempts. Please wait a few minutes and try again.";
  }

  // Network errors
  if (lower.includes("fetch") || lower.includes("network") || lower.includes("timeout")) {
    return "Something went wrong. Check your connection and try again.";
  }

  if (context === "signup") {
    if (lower.includes("already registered") || lower.includes("already been registered")) {
      return "ALREADY_REGISTERED";
    }
    if (lower.includes("weak password") || lower.includes("too weak")) {
      return "Password is too weak. Use at least 8 characters with a mix of letters and numbers.";
    }
  }

  if (context === "login") {
    if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
      return "Incorrect email or password.";
    }
    if (lower.includes("email not confirmed") || lower.includes("not confirmed")) {
      return "EMAIL_NOT_CONFIRMED";
    }
  }

  if (context === "oauth") {
    if (lower.includes("cancelled") || lower.includes("canceled") || lower.includes("user denied")) {
      return "OAUTH_CANCELLED";
    }
    return "Google sign-in failed. Please try again or use email instead.";
  }

  if (context === "reset") {
    if (lower.includes("expired") || lower.includes("invalid")) {
      return "This reset link has expired. Please request a new one.";
    }
  }

  return "Something went wrong. Please try again.";
}
