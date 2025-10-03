import Container from "@components/container";
import { useGetOrderByUser } from "@framework/api/orders/get-by-user";
// ИСПРАВЛЕНО: Импортируем тип для одного заказа
import { Order } from "@framework/types"; 
import { GetOrderStatus } from "@helpers/get-order-status";
import useTelegramUser from "@hooks/useTelegramUser";
import { addCommas } from "@persian-tools/persian-tools";
import { Table } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "jalali-moment";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

// ИСПРАВЛЕНО: Добавили поле price в интерфейс данных для таблицы
interface DataType {
  key: string;
  name: string;
  code: string;
  time: string;
  status: string;
  tracking_code: string;
  price: number;
}
interface Props {
  type: "profile" | "user";
}

function OrderList({ type }: Props) {
  // ИСПРАВЛЕНО: Безопасно получаем пользователя и его ID
  const user = useTelegramUser();
  const userId = user?.id ? String(user.id) : "";
  const location = useLocation();

  const { data, isLoading, isFetching, refetch } = useGetOrderByUser({
    // ИСПРАВЛЕНО: Используем безопасный userId
    user_id: userId
  });

  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [refetch, location, userId]);

  // ИСПРАВЛЕНО: Говорим TypeScript "доверять" нам, что в `data` есть свойство `orders`
  const orders = (data as any)?.orders || [];

  // ИСПРАВЛЕНО: Указываем, что `item` имеет тип `Order`
  const dataChangingStructure: DataType[] =
    orders.map((item: Order) => ({
      key: item.order_Id.toString(),
      code: item.order_Id.toString(),
      name: item.user_Full_Name,
      price: item.total_Price,
      status: item.order_Status,
      time: item.order_Date,
      tracking_code: item.tracking_Code
    })) || [];

  const columns: ColumnsType<DataType> = [
    {
      // ПЕРЕВЕДЕНО
      title: "Номер",
      width: "fit-content",
      dataIndex: "code",
      key: "code",
      render: (text, record) => (
        <Link
          to={`/profile/orders/${record.key}`}
          className="text-blue-[var(--tg-theme-button-color)]">
          #{text}
        </Link>
      )
    },
    {
      // ПЕРЕВЕДЕНО
      title: "Имя",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link
          to={`/profile/orders/${record.key}`}
          className="text-blue-[var(--tg-theme-button-color)]">
          {text}
        </Link>
      )
    },
    {
      // ПЕРЕВЕДЕНО
      title: "Сумма",
      dataIndex: "price",
      key: "price",
      render: (text) => (
        // Убрали Link, так как он уже есть в других колонках
        <span>{addCommas(text || 0)} руб.</span>
      )
    },
    {
      // ПЕРЕВЕДЕНО
      title: "Статус",
      dataIndex: "status",
      key: "status",
      render: (text) => <p>{GetOrderStatus(text)}</p>
    },
    {
      // ПЕРЕВЕДЕНО
      title: "Дата заказа",
      dataIndex: "time",
      key: "time",
      render: (text) => (
        // Убрали .locale("fa"), чтобы формат даты был универсальным
        <p>{moment(text).format("YYYY/MM/DD") || ""}</p>
      )
    }
  ];

  return (
    // ПЕРЕВЕДЕНО
    <Container backwardUrl={-1} title="Список заказов">
      <Table
        columns={columns}
        loading={isLoading || isFetching}
        scroll={{ x: 400 }}
        dataSource={dataChangingStructure}
      />
    </Container>
  );
}

export default OrderList;