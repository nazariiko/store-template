export const authErrorMessages = {
  user_exists: "Користувач з таким email-ом вже існує",
  user_not_exists: "Користувача з таким email-ом не існує",
  admin_panel_access_denied:
    "У вас немає доступу до адмін-панелі. Зайдіть в систему під користувачем з необхідними правами",
  default: "Помилка автентифікації",
} as const;

export type AuthErrorCode = keyof typeof authErrorMessages;
