import React from "react";
import { Container, Card } from "react-bootstrap";

function ApprovalRequestPage() {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>📝 기안 작성</Card.Header>
        <Card.Body>
          <p>여기에 기안서 작성 폼이 들어갑니다.</p>
          <p>제목, 내용, 결재자 지정 등의 UI를 추가하면 됩니다.</p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ApprovalRequestPage;
