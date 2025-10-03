/* eslint-disable implicit-arrow-linebreak */
import { Product, TypeListProducts } from "@framework/types";
import { useQuery } from "@tanstack/react-query";

// ИСПРАВЛЕНО: Убираем qs и Api, они нам больше не нужны
// import qs from "query-string";
// import Api from "../utils/api-config";

interface Props {
  name?: string;
  sortBy?: "Product_Name" | "Updated_At" | "Price";
  order?: "asc" | "desc";
  limit?: number;
  page?: number;
  categoryId?: number;
}

// ИСПРАВЛЕНО: Полностью переписываем функцию `fetch`
const fetch = async ({ queryKey }: any): Promise<TypeListProducts> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_key, categoryId, limit, name, order, page, sortBy] = queryKey;

  // 1. Загружаем нашу "базу данных"
  const response = await window.fetch('/products.json');
  const allData = await response.json();
  let filteredProducts: Product[] = allData.products;

  // 2. Симулируем поиск по имени (если он есть)
  if (name) {
    filteredProducts = filteredProducts.filter(product =>
      product.product_Name.toLowerCase().includes(name.toLowerCase())
    );
  }

  // 3. Симулируем сортировку
  if (sortBy === "Price") {
    filteredProducts.sort((a, b) => {
      if (order === 'asc') {
        return a.price - b.price;
      }
      return b.price - a.price; // desc
    });
  }

  // 4. Симулируем пагинацию (отдаем нужную "страницу" товаров)
  const totalRows = filteredProducts.length;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // 5. Возвращаем данные в том же формате, который ожидает фронтенд
  return {
    page,
    limit,
    totalRows,
    products: paginatedProducts
  };
};

export const useGetProducts = ({
  categoryId,
  limit = 10,
  name,
  order,
  page = 1,
  sortBy = "Price"
}: Props) =>
  useQuery<TypeListProducts>(
    ["products", categoryId, limit, name, order, page, sortBy],
    fetch,
    // Добавляем эту опцию, чтобы данные не считались "устаревшими"
    { staleTime: Infinity } 
  );