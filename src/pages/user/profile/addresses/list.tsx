/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable camelcase */
/* eslint-disable react/jsx-wrap-multilines */

import Container from "@components/container";
import useDeleteAddress from "@framework/api/address/delete";
import { useGetAddresses } from "@framework/api/address/get";
import useTelegramUser from "@hooks/useTelegramUser";
import { Button, List, message, Popconfirm } from "antd";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

function AddessesList() {
  const navigate = useNavigate();
  // ИСПРАВЛЕНО: Безопасно получаем пользователя и его ID
  const user = useTelegramUser();
  const userId = user?.id ? String(user.id) : "";

  // ИСПРАВЛЕНО: Используем безопасный userId
  const { data, isLoading, isFetching, refetch } = useGetAddresses(userId);
  const deleteMutation = useDeleteAddress();
  const location = useLocation();

  useEffect(() => {
    // Добавим проверку, чтобы не делать лишний запрос, если ID еще нет
    if (userId) {
      refetch();
    }
  }, [location, userId]);

  return (
    <Container
      // ПЕРЕВЕДЕНО
      title="Мои адреса"
      customButton
      // ПЕРЕВЕДЕНО
      customButtonTitle="Добавить адрес"
      customButtonOnClick={() => navigate("add")}
      backwardUrl="/">
      <List
        loading={isLoading || isFetching}
        itemLayout="horizontal"
        dataSource={data?.addresses}
        renderItem={(item, index) => (
          <List.Item key={index}>
            <List.Item.Meta
              title={<div className="w-full text-start">{item.city}, {item.street}</div>}
              description={
                <div className="flex gap-3  ">
                  <div className="flex flex-row-reverse gap-2">
                    <span>{item.state}</span>
                  </div>
                  <div>
                    <span>{item.zipcode}</span>
                  </div>
                </div>
              }
            />

            <div className="flex gap-2">
              <Popconfirm
                placement="left"
                // ПЕРЕВЕДЕНО
                title="Вы уверены, что хотите удалить?"
                onConfirm={() => {
                  // ИСПРАВЛЕНО: Добавляем проверку, что все ID на месте
                  if (!userId || item.address_Id === undefined) {
                    message.error("Не удалось получить данные для удаления");
                    return;
                  }
                  deleteMutation.mutate(
                    { user_id: userId, address_id: item.address_Id },
                    {
                      onSuccess: () => {
                        // ПЕРЕВЕДЕНО
                        message.success("Адрес успешно удален");
                        refetch();
                      },
                      onError: () => {
                        // ПЕРЕВЕДЕНО
                        message.error("Произошла ошибка. Попробуйте снова");
                        refetch();
                      }
                    }
                  );
                }}
                // ПЕРЕВЕДЕНО
                okText="Удалить"
                okType="default"
                // ПЕРЕВЕДЕНО
                cancelText="Отмена">
                <Button
                  key={index}
                  size="small"
                  loading={deleteMutation.isLoading}>
                  {/* ПЕРЕВЕДЕНО */}
                  Удалить
                </Button>
              </Popconfirm>
              <Button
                onClick={() => navigate(`${item.address_Id}`)}
                size="small">
                {/* ПЕРЕВЕДЕНО */}
                Изменить
              </Button>
            </div>
          </List.Item>
        )}
      />
    </Container>
  );
}

export default AddessesList;