export const authErrorMessages = {
  user_exists: 'Користувач з таким email-ом вже існує',
  user_not_exists: 'Користувача з таким email-ом не існує',
  admin_panel_access_denied:
    'У вас немає доступу до адмін-панелі. Зайдіть в систему під користувачем з необхідними правами',
  default: 'Помилка автентифікації',
} as const;

export type AuthErrorCode = keyof typeof authErrorMessages;

export const commonErrorMessages = {
  user_role_exists: 'Назви та еліас ролі мають бути унікальними',
  user_role_rank_error: 'У вас немає прав створювати/редагувати/видаляти роль з таким рангом',
  user_role_not_exists: 'Ролі не існує',
  user_role_client_cannot_delete: 'Не можна видаляти роль клієнта',
  user_not_exists: 'Юзера з таким ідентифікатором не існує',
} as const;

export type CommonErrorCode = keyof typeof commonErrorMessages;

export const commonSuccessMessages = {
  user_role_created: 'Роль успішно створена',
  user_role_updated: 'Роль успішно редагована',
  user_role_deleted: 'Роль успішно видалена',
} as const;

export type CommonSuccessCode = keyof typeof commonSuccessMessages;
