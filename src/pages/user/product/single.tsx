// src/pages/user/product/single.tsx - ИСПРАВЛЕННАЯ И ПЕРЕВЕДЕННАЯ ВЕРСИЯ

/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable radix */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable camelcase */
/* eslint-disable object-curly-newline */
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined
} from "@ant-design/icons";
import Container from "@components/container";
import UserSingleProductSkeleton from "@components/skeleton/user-single-product";
import useAddToCart from "@framework/api/cart/add";
import { useGetProductsById } from "@framework/api/product/get-by-id";
import useTelegramUser from "@hooks/useTelegramUser";
import { addCommas } from "@persian-tools/persian-tools";
import {
  Alert,
  Button,
  Carousel,
  Image,
  InputNumber,
  Tabs,
  message
} from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

function ProductSingle() {
  const [count, setCount] = useState(1);
  const { product_id } = useParams();
  const mutation = useAddToCart();
  // ИСПРАВЛЕНО: Безопасно получаем пользователя
  const user = useTelegramUser(); 
  const { data, isLoading, refetch, isFetching } = useGetProductsById({
    product_id: product_id || "0" // API ожидает строку
  });

  useEffect(() => {
    refetch();
  }, [product_id]); // Запускаем refetch при смене product_id

  const onChange = (key: string) => {
    console.log(key);
  };

  const handleAddToCart = () => {
    // ИСПРАВЛЕНО: Добавляем проверки на наличие всех данных
    if (!user?.id) {
      message.error("Не удалось получить ID пользователя. Попробуйте перезапустить приложение.");
      return;
    }
    if (!product_id) {
      message.error("Не удалось получить ID товара.");
      return;
    }

    mutation.mutate(
      {
        user_id: String(user.id), // Явно преобразуем в строку
        cart_items: [
          {
            product_id: parseInt(product_id),
            quantity: count
          }
        ]
      },
      {
        onSuccess: () => {
          // ПЕРЕВЕДЕНО
          message.success("Товар добавлен в корзину");
        },
        onError: () => {
          // ПЕРЕВЕДЕНО
          message.error("Произошла ошибка. Пожалуйста, попробуйте позже.");
        }
      }
    );
  };

  const decriment = () => count > 1 && setCount(count - 1);
  const incriment = () => count < (data?.quantity ?? 100) && setCount(count + 1);
  
  // ИСПРАВЛЕНО: Безопасное вычисление скидки
  const discountPercentage =
    data?.price && data?.discountedPrice && data.discountedPrice < data.price
      ? 100 - (data.discountedPrice * 100) / data.price
      : 0;
  
  return (
    <Container title={data?.product_Name || ""} backwardUrl={-1}>
      {isFetching || isLoading ? (
        <UserSingleProductSkeleton />
      ) : (
        <div className="flex flex-col gap-3">
          {data?.quantity === 0 && (
            // ПЕРЕВЕДЕНО
            <Alert message="Этого товара нет в наличии" type="error" showIcon />
          )}

          <div className=" flex h-fit w-full items-center justify-center ">
            <Carousel className="h-full w-full" rootClassName="w-full h-full">
              {/* ИСПРАВЛЕНО: Тип Product не имеет `photos`, но имеет `photo_path`. Оборачиваем его в массив для карусели */}
              {data?.photo_path && (
                <Image
                  src={`${import.meta.env.VITE_API_URL}/${data.photo_path}`}
                  alt={data?.product_Name}
                  className="h-full w-full rounded-lg"
                  preview
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                />
              )}
            </Carousel>
          </div>
          <div className=" my-6 text-right">{data?.product_Name}</div>
          <div className="flex w-full flex-row-reverse items-center justify-start gap-3">
            {discountPercentage > 0 && (
              <span className="rounded-lg  bg-red-700/50 p-2">
                {discountPercentage.toFixed(0)} %
              </span>
            )}

            <div
              className={`flex flex-row items-center gap-2 self-end text-right ${
                discountPercentage > 0 && " text-gray-500 line-through"
              }`}>
              {/* ПЕРЕВЕДЕНО */}
              <span>руб.</span> <span>{addCommas(data?.price ?? 0)}</span>
            </div>
            {discountPercentage > 0 && (
              <div className="flex flex-row items-center gap-2 self-end text-right">
                {/* ПЕРЕВЕДЕНО */}
                <span>руб.</span>{" "}
                <span>{addCommas(data?.discountedPrice ?? 0)}</span>
              </div>
            )}
          </div>
          <div className="my-4 flex flex-col gap-2">
            <div className="flex w-44 items-center justify-center gap-2">
              <Button
                htmlType="button"
                type="primary"
                ghost
                className="flex h-full w-10 items-center justify-center rounded-l-lg bg-gray-300"
                onClick={incriment}>
                <PlusOutlined />
              </Button>
              <InputNumber
                controls={false}
                className="text-center"
                min={1}
                max={data?.quantity ?? 100}
                maxLength={3}
                // ИСПРАВЛЕНО: Правильная обработка onChange
                onChange={(value) => {
                  if (value && value >= 1) {
                    setCount(value);
                  }
                }}
                value={count}
              />
              <Button
                htmlType="button"
                type="primary"
                ghost
                className="flex h-full w-10 items-center justify-center rounded-r-lg bg-gray-300"
                onClick={decriment}>
                <MinusOutlined />
              </Button>
            </div>
            <Button
              className="w-full"
              disabled={data?.quantity === 0}
              loading={mutation.isLoading}
              onClick={handleAddToCart}
              size="large"
              type="primary"
              icon={<ShoppingCartOutlined />}
              ghost>
              {/* ПЕРЕВЕДЕНО */}
              Добавить в корзину
            </Button>
          </div>
          <div>
            <Tabs
              defaultActiveKey="1"
              items={[
                {
                  key: "1",
                  // ПЕРЕВЕДЕНО
                  label: "Описание",
                  children: (
                    <p
                      style={{ whiteSpace: "pre-line" }}
                      className="text-right">
                      {data?.description}
                    </p>
                  )
                }
              ]}
              onChange={onChange}
            />
          </div>
        </div>
      )}
    </Container>
  );
}
export default ProductSingle;