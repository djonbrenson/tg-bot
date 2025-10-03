import Container from "@components/container";
import ProductLists from "@components/product/list";
import ProductsSkeleton from "@components/skeleton/products";
// import { useGetProducts } from "@framework/api/product/get"; // Больше не нужно
import { Suspense } from "react";

function UserCategoriesList() {
  // const { data } = useGetProducts({}); // УДАЛЕНО
  return (
    <Container title="Продукты" backwardUrl="/">
      <Suspense fallback={<ProductsSkeleton />}>
        {/* УДАЛЕНО data={data} */}
        <ProductLists pageType="user" />
      </Suspense>
    </Container>
  );
}

export default UserCategoriesList;