import BlankPage from "../../components/BlankPage";
import GroupOrderProcess from "../../components/GroupOrderProcess";

export default function Page() {
  return (
    <BlankPage ko="단체주문 예약" en="Group Order Reservation" position="top-center">
      <GroupOrderProcess />
    </BlankPage>
  );
}
