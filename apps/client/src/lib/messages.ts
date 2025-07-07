export const authErrorMessages = {
  user_exists: "Користувач з таким email-ом вже існує",
  user_not_exists: "Користувача з таким email-ом не існує",
  default: "Помилка автентифікації",
} as const;

export type AuthErrorCode = keyof typeof authErrorMessages;
