import Container from "@components/container";
import useGetUserInfo from "@framework/api/user-information/get";
import useUpdateUser from "@framework/api/user-information/update";
import useTelegramUser from "@hooks/useTelegramUser";
// ВНИМАНИЕ: этот валидатор проверяет только иранские номера. Для РФ может потребоваться другая логика.
import { phoneNumberValidator } from "@persian-tools/persian-tools"; 
import { Button, Form, Input, message, Spin } from "antd";
import { useNavigate } from "react-router";

function EditProfile() {
  const [form] = Form.useForm();
  // ИСПРАВЛЕНО: Безопасно получаем пользователя
  const user = useTelegramUser();
  const userId = user?.id ? String(user.id) : "";

  // ИСПРАВЛЕНО: Передаем в хуки безопасный userId
  const { data, isFetching, isLoading } = useGetUserInfo({ user_Id: userId });
  const mutation = useUpdateUser({ user_id: userId });
  const navigate = useNavigate();
  const dataLoading = isFetching || isLoading;

  return (
    // ПЕРЕВЕДЕНО
    <Container title="Редактирование профиля" backwardUrl={-1}>
      <Spin spinning={dataLoading}>
        {dataLoading ? (
          <div className="h-[350px]" />
        ) : (
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{
              phone_number: data?.phone_Number,
              name: data?.name,
              last_name: data?.last_Name,
              email: data?.email,
              username: data?.username
            }}
            onFinish={(values) => {
              // Валидация номера телефона. Для РФ может потребоваться другая.
              if (!phoneNumberValidator(values.phone_number)) {
                // ПЕРЕВЕДЕНО
                message.error("Введенный номер телефона некорректен");
                form.scrollToField("phone_number");
              } else {
                mutation.mutate(values, {
                  onSuccess: () => {
                    // ПЕРЕВЕДЕНО
                    message.success("Данные профиля успешно обновлены");
                    navigate(-1);
                  },
                  onError: () => {
                    // ПЕРЕВЕДЕНО
                    message.error("Произошла ошибка при обновлении профиля");
                  }
                });
              }
            }}
            autoComplete="off">
            <Form.Item
              // ПЕРЕВЕДЕНО
              label="Имя"
              name="name"
              // ПЕРЕВЕДЕНО
              rules={[{ required: true, message: "Обязательное поле" }]}>
              <Input />
            </Form.Item>
            <Form.Item
              // ПЕРЕВЕДЕНО
              label="Фамилия"
              name="last_name"
              // ПЕРЕВЕДЕНО
              rules={[{ required: true, message: "Обязательное поле" }]}>
              <Input />
            </Form.Item>
            <Form.Item 
              // ПЕРЕВЕДЕНО
              label="Имя пользователя" 
              name="username">
              <Input disabled />
            </Form.Item>
            <Form.Item
              // ПЕРЕВЕДЕНО
              label="Email"
              // ПЕРЕВЕДЕНО
              rules={[{ required: true, message: "Обязательное поле" }]}
              name="email">
              <Input type="email" />
            </Form.Item>
            <Form.Item
              // ПЕРЕВЕДЕНО
              label="Номер телефона"
              name="phone_number"
              rules={[
                {
                  // ПЕРЕВЕДЕНО
                  required: true,
                  message: "Обязательное поле"
                }
              ]}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button className="w-full " size="large" htmlType="submit">
                {/* ПЕРЕВЕДЕНО */}
                Сохранить
              </Button>
            </Form.Item>
          </Form>
        )}
      </Spin>
    </Container>
  );
}

export default EditProfile;