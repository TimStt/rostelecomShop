import { ProtectedRoute } from "@/shared/ui/protected-route";
import { OrderBlocks } from "@/widgets/order-blocks";

const OrderPage = () => {
  return (
    <ProtectedRoute>
      <OrderBlocks />
    </ProtectedRoute>
  );
};
export default OrderPage;
