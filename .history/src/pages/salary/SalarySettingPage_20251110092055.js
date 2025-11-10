import React from "react";
import { Tabs, Tab, Container } from "react-bootstrap";
import PositionSalaryPage from "./salary/PositionSalaryPage";
import MemberSalaryPage from "./salary/MemberSalaryPage";

function SalarySettingPage() {
  return (
    <Container className="mt-4">
      <h2 className="mb-3">급여 설정 관리</h2>

      <Tabs defaultActiveKey="position" id="salary-tabs" className="mb-3">
        <Tab eventKey="position" title="직위별 급여 관리">
          <PositionSalaryPage />
        </Tab>
        <Tab eventKey="member" title="개인별 급여 관리">
          <MemberSalaryPage />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default SalarySettingPage;
