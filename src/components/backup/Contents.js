import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import MenuLayout from "./MenuLayout";

export default function Contents({ children }) {
    return (
        <Container fluid className="flex-grow-1 h-100 p-3">
            <Row className="h-100">
                {/* 왼쪽 메뉴 영역 (대분류 + 하위 메뉴) */}
                <Col md={3} className="border-end p-0" style={{ height: "100%" }}>
                    <MenuLayout />
                </Col>

                {/* 오른쪽 페이지 컨텐츠 */}
                <Col md={9} className="p-4" style={{ height: "100%", overflowY: "auto" }}>
                    {children}
                </Col>
            </Row>
        </Container>
    );
}
