/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable indent */
/* eslint-disable object-curly-newline */
// eslint-disable-next-line object-curly-newline
import Container from "@components/container";
import useAddCategories from "@framework/api/categories/add";
import useTelegramUser from "@hooks/useTelegramUser";
import { Button, Form, Input, message } from "antd";
import { useNavigate, useParams } from "react-router";

interface FromProps {
  name: string;
  description?: string;
}

function CategoriesAdd() {
  const [form] = Form.useForm();
  const mutation = useAddCategories();
  // ИСПРАВЛЕНО: Безопасно получаем пользователя
  const user = useTelegramUser();
  const userId = user?.id ? String(user.id) : "";

  const { parentId } = useParams();
  const navigate = useNavigate();
  return (
    // ПЕРЕВЕДЕНО
    <Container title="Добавление категории" backwardUrl={-1}>
      <Form
        form={form}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        className="flex  h-full flex-col items-stretch justify-start"
        onFinish={({ name }: FromProps) => {
          if (!userId) {
            message.error("Не удалось получить ID пользователя");
            return;
          }
          mutation.mutate(
            {
              user_id: userId,
              category_name: name,
              // ИСПРАВЛЕНО: Правильно обрабатываем parent_id
              parent_id: parentId ? parseInt(parentId) : undefined
            },
            {
              onSuccess: () => {
                // ПЕРЕВЕДЕНО
                message.success("Категория успешно добавлена");
                form.resetFields();
                navigate("/admin/categories");
              },
              onError: () => {
                // ПЕРЕВЕДЕНО
                message.error("Произошла ошибка. Попробуйте позже.");
              }
            }
          );
        }}>
        {/* ПЕРЕВЕДЕНО */}
        <Form.Item name="name" required label="Название">
          <Input required />
        </Form.Item>

        <Button
          type="primary"
          loading={mutation.isLoading}
          disabled={mutation.isLoading}
          style={{ width: "100%" }}
          size="large"
          ghost
          className="mt-auto"
          htmlType="submit">
          {/* ПЕРЕВЕДЕНО */}
          Сохранить
        </Button>
      </Form>
    </Container>
  );
}

export default CategoriesAdd;