"use client";
import BlankPage from "../../../components/BlankPage";
import AllergyTable from "../../../components/AllergyTable";

export default function Page() {
  return (
    <BlankPage ko="알레르기 정보" en="Allergy Info">
      <AllergyTable />
    </BlankPage>
  );
}
