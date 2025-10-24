import React from "react";
import { Container, Table, Card } from "react-bootstrap";

function ApprovalTempPage() {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Header>📂 임시 보관함</Card.Header>
        <Card.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>문서 제목</th>
                <th>작성일</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>연차신청서 초안</td>
                <td>2025-10-24</td>
                <td>작성 중</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default ApprovalTempPage;
