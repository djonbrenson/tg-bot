/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable camelcase */
import { TypePostUserInfo } from "@framework/types";
import { useMutation } from "@tanstack/react-query";

// ИСПРАВЛЕНО: Api нам больше не нужен
// import Api from "../utils/api-config";

const useUpdateUser = ({ user_id }: { user_id: string | number }) =>
  useMutation({
    mutationKey: ["update-user"],
    // ИСПРАВЛЕНО: Заменяем настоящий запрос на "обманку"
    mutationFn: (props: TypePostUserInfo) => {
      console.log("Имитация сохранения данных профиля:", { user_id, ...props });

      // Создаем промис, который делает вид, что работает 0.5 секунды,
      // а потом всегда возвращает "успех".
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true, message: "Профиль успешно обновлен" });
        }, 500);
      });
    }
  });

export default useUpdateUser;