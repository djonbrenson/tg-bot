// src/pages/user/checkout/index.tsx - ФИНАЛЬНАЯ ИСПРАВЛЕННАЯ ВЕРСИЯ

/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-wrap-multiline */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable operator-linebreak */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import Container from "@components/container";
import { useGetAddresses } from "@framework/api/address/get";
import { useGetCarts } from "@framework/api/cart/get";
// ИСПРАВЛЕНО: импортируем правильный тип из твоего файла types.ts
import { TypeCartItems } from "@framework/types"; 
import useTelegramUser from "@hooks/useTelegramUser";
import { addCommas } from "@persian-tools/persian-tools";
import { Alert, Button, Form, Input, message, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

function Checkout() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useTelegramUser();
  const { state: locState } = useLocation();
  const navigate = useNavigate();

  const userId = user?.id;

  // ИСПРАВЛЕНО: Вызываем хуки только с одним аргументом (ID пользователя) и преобразуем его в строку
  const { data: CartData, isLoading: isCartLoading } = useGetCarts(
    userId ? String(userId) : ""
  );
  const { data: addressData, isLoading: isAddressLoading, refetch } = useGetAddresses(
    userId ? String(userId) : ""
  );

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (!locState) {
      navigate("/cart");
    } else if (userId) {
      refetch();
    }
  }, [locState, userId, refetch, navigate]);

  useEffect(() => {
    if (!isAddressLoading && (!addressData || !addressData?.addresses || addressData?.addresses.length === 0)) {
      message.warning({
        content: "Пожалуйста, добавьте адрес в профиле, прежде чем продолжить",
        duration: 3
      });
    }
  }, [addressData, isAddressLoading]);

  const handleOrderSubmit = async (values: any) => {
    // ИСПРАВЛЕНО: Проверяем наличие cartItems вместо products
    if (!user || !CartData || !CartData.cartItems) {
      message.error("Не удалось загрузить данные для заказа. Попробуйте обновить страницу.");
      return;
    }

    setIsSubmitting(true);

    const selectedAddress = addressData?.addresses.find(
      (addr) => addr.address_Id === values.address
    );
    const addressString = selectedAddress
      ? `${selectedAddress.country}, ${selectedAddress.state}, ${selectedAddress.city}, ${selectedAddress.street}, ${selectedAddress.zipcode}`
      : "Адрес не выбран";

    const orderPayload = {
      customer: {
        first_name: user.first_name || "Не указано",
        last_name: user.last_name || "Не указано",
        phone_number: "Не указан"
      },
      // ИСПРАВЛЕНО: 
      // 1. Используем правильный массив `CartData.cartItems`
      // 2. Указываем правильный тип `TypeCartItems` для `item`
      // 3. Берем `name` из `item.product_Name`
      products: CartData.cartItems.map((item: TypeCartItems) => ({
        product: {
          id: item.product_Id,
          name: item.product_Name 
        },
        quantity: item.quantity
      })),
      address: {
        address: addressString
      },
      description: values.order_Description || "Нет комментария",
      totalPrice: CartData.totalPrice
    };

    try {
      const backendUrl = `${import.meta.env.VITE_API_URL}/${import.meta.env.VITE_SHOP_NAME}/${import.meta.env.VITE_API_VERSION}/orders/add`;
      await axios.post(backendUrl, orderPayload);
      message.success("Ваш заказ успешно оформлен! Мы скоро с вами свяжемся.");
      navigate("/");
    } catch (err) {
      console.error("Ошибка при отправке заказа:", err);
      message.error("Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCartLoading || isAddressLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Container title="Оформление заказа" backwardUrl={-1}>
      <div>
        <Alert
          message={
            <div>
              <div className="mb-2">Информация о заказе</div>
              <div className="flex flex-col items-center justify-center">
                <span>
                  Итоговая сумма:
                  <b className="mr-2 gap-3 text-lg">
                    {addCommas(CartData?.totalPrice || 0)} <span>руб.</span>
                  </b>
                </span>
              </div>
            </div>
          }
          type="info"
          showIcon
        />
        <br />

        <Form
          className="mt-5"
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          onFinish={handleOrderSubmit}
          onFinishFailed={onFinishFailed}
          autoComplete="off">
          
          <Form.Item name="address" label="Адрес" rules={[{ required: true }]}>
            <Select
              loading={isAddressLoading}
              placeholder="Выберите ваш адрес"
              allowClear>
              {addressData?.addresses.map((item) => (
                <Select.Option key={item.address_Id} value={item.address_Id}>
                  {item.country},{item.state},{item.city},{item.street},
                  {item.zipcode} ...
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="order_Description" label="Дополнительная информация">
            <Input.TextArea rows={4} placeholder="Например, 'позвонить за час до доставки'"/>
          </Form.Item>

          <Button
            disabled={!addressData?.addresses || addressData?.addresses.length === 0}
            loading={isSubmitting}
            type="default"
            className="w-full"
            size="large"
            htmlType="submit">
            Оформить заказ
          </Button>
        </Form>
      </div>
    </Container>
  );
}

export default Checkout;