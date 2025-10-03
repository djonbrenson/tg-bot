export const GetOrderStatus = (e: string) => {
  switch (e) {
    case "Pending":
      return "Ожидает подтверждения";
    case "Processing":
      return "В процессе";
    case "Packing":
      return "Упаковывается";
    case "CancelledByCustomer":
      return "Отменено клиентом";
    case "CancelledDueToUnavailability":
      return "Нет в наличии 1 или нескольких товаров";
    case "CancelledByAdmin":
      return "Отменено админом";
    case "Shipped":
      return "Доставлено";
    default:
      return "Ожидает подтверждения";
  }
};
