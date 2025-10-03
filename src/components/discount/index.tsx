// src/components/discount/index.tsx - ИСПРАВЛЕННАЯ ВЕРСИЯ

import useAddDiscounts from "@framework/api/discount/add";
import useDeleteDiscount from "@framework/api/discount/delete";
import useUpdateDiscount from "@framework/api/discount/update";
import { TypeDiscount, TypeUpdateDiscount } from "@framework/types";
import useTelegramUser from "@hooks/useTelegramUser";
import {
  Alert,
  Button,
  Divider,
  Form,
  InputNumber,
  message,
  Popconfirm
} from "antd";
import { DatePicker, useJalaliLocaleListener } from "antd-jalali";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import moment from "jalali-moment";

interface Props {
  type: "product" | "category";
  id: string;
  data: TypeDiscount | null;
}

function Discount({ type, id, data }: Props) {
  // ИСПРАВЛЕНО: Безопасно получаем пользователя
  const user = useTelegramUser();
  const mutation = useAddDiscounts();
  const updateMutation = useUpdateDiscount({
    discount_id: data?.discount_Id || ""
  });
  const deleteMutation = useDeleteDiscount();
  
  const disabledDate: RangePickerProps["disabledDate"] = (current) =>
    current && current < dayjs().endOf("day");
  useJalaliLocaleListener();

  const handleDeleteDiscount = () => {
    // ИСПРАВЛЕНО: Добавляем проверку, что все данные на месте
    if (!data || !user?.id) {
      message.error("Не удалось получить данные для удаления.");
      return;
    }

    deleteMutation.mutate(
      {
        // ИСПРАВЛЕНО: Превращаем ID скидки и ID пользователя в строки
        discount_id: String(data.discount_Id),
        user_id: String(user.id)
      },
      {
        onSuccess: () => {
          message.success("Скидка успешно удалена");
          window.location.reload();
        },
        onError: () => {
          message.error("Произошла ошибка при удалении скидки");
        }
      }
    );
  };

  return (
    <div>
      {/* сикдки */}
      <Divider> Скидки </Divider>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        initialValues={{
          percent: data?.discount_Value,
          discount_start_date: data ? dayjs(data.discount_Start_Date) : null,
          discount_end_date: data ? dayjs(data.discount_End_Date) : null
        }}
        layout="horizontal"
        className="flex w-full flex-col justify-center gap-4"
        onFinish={({ percent, discount_start_date, discount_end_date }) => {
          if (!user?.id) {
            message.error("Не удалось получить ID пользователя.");
            return;
          }
          const baseValues = {
            category_id: type === "category" ? parseInt(id, 10) : null,
            product_id: type === "product" ? parseInt(id, 10) : null,
            // ИСПРАВЛЕНО: Явно указываем тип, чтобы TypeScript не ругался
            discount_type: "percent" as "percent" | "price",
            discount_value: percent,
            discount_start_date: moment(discount_start_date.$d).format() || "",
            discount_end_date: moment(discount_end_date.$d).format() || "",
            user_id: String(user.id)
          };
          
          if (data) {
            // ИСПРАВЛЕНО: Добавляем недостающий `discount_Id` для обновления
            const updateValues: TypeUpdateDiscount = {
              ...baseValues,
              discount_Id: data.discount_Id
            };
            updateMutation.mutate(updateValues, {
              onSuccess: () => {
                message.success("Скидка успешно обновлена");
              },
              onError: () => {
                message.error("Произошла ошибка при обновлении");
              }
            });
          } else {
            mutation.mutate(baseValues, {
              onSuccess: () => {
                message.success("Скидка успешно создана");
              },
              onError: () => {
                message.error("Произошла ошибка при создании");
              }
            });
          }
        }}>
        <Alert
          type="info"
          message="Скидка применяется в процентах, от 1 до 100"
          showIcon
        />
        {/* процент */}
        <Form.Item name="percent" required label="Процент">
          <InputNumber min={1} addonAfter="%" max={100} required />
        </Form.Item>

        {/* начало */}
        <Form.Item name="discount_start_date" required label="Начало">
          <DatePicker />
        </Form.Item>
        {/* окончание */}
        <Form.Item name="discount_end_date" required label="Окончание">
          <DatePicker disabledDate={disabledDate} />
        </Form.Item>

        <div className="flex gap-3">
          {data && (
            <Popconfirm
              placement="top"
              title="Вы уверены, что хотите удалить скидку?"
              onConfirm={handleDeleteDiscount}
              okText="Удалить"
              okType="default"
              cancelText="Отмена">
              <Button
                size="large"
                loading={deleteMutation.isLoading}
                style={{ width: "36%" }}
                danger>
                {/* удалить */}
                Удалить
              </Button>
            </Popconfirm>
          )}
          <Button
            type="primary"
            loading={mutation.isLoading || updateMutation.isLoading}
            style={{ width: data ? "65%" : "100%" }}
            size="large"
            ghost
            htmlType="submit">
            {/* сохр */}
            Сохранить
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default Discount;