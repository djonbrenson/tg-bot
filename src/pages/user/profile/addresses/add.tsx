/* eslint-disable object-curly-newline */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-wrap-multilines */
import Container from "@components/container";
import useAddAddress from "@framework/api/address/add";
import { TypeAddAddress } from "@framework/types";
import useTelegramUser from "@hooks/useTelegramUser";
import { Button, Form, Input, message } from "antd";
import { useNavigate } from "react-router";

function AddAddress() {
  const navigate = useNavigate();
  const mutation = useAddAddress();
  const { id } = useTelegramUser();
  const onFinish = ({
    city,
    country,
    state,
    street,
    user_id,
    zipcode
  }: TypeAddAddress) => {
    mutation.mutate(
      {
        city,
        country,
        state,
        street,
        user_id,
        zipcode,
        user_Id: `${id}`
      },
      {
        onSuccess: () => {
          message.success("Ваш адрес успешно добавлен");
          setTimeout(() => navigate(-1), 1000);
        },
        onError: () => {
          message.error("Произошла ошибка, попробуйте ещё раз");
        }
      }
    );
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Container title="Добавить новый адрес" backwardUrl={-1}>
      <Form
        disabled={mutation.isLoading}
        name="basic"
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off">
        <Form.Item
          label="Страна"
          name="country"
          rules={[{ required: true, message: "Пожалуйста, введите страну" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Область/Регион"
          name="state"
          rules={[{ required: true, message: "Пожалуйста, введите область/регион" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Город"
          name="city"
          rules={[{ required: true, message: "Пожалуйста, введите город" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Улица (переулок и дорога)"
          name="street"
          rules={[{ required: true, message: "Пожалуйста, введите улицу" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Почтовый индекс"
          name="zipcode"
          rules={[{ required: true, message: "Пожалуйста, введите почтовый индекс" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button
            loading={mutation.isLoading}
            type="primary"
            ghost
            size="large"
            className="w-full"
            htmlType="submit">
            Добавить адрес
          </Button>
        </Form.Item>
      </Form>
    </Container>
  );
}

export default AddAddress;
