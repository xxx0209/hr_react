// Layout.js
import { Container, Row, Col } from "react-bootstrap";
import MenuItems from "../ui/MenuItems";
import MenuLayout from "./MenuLayout";
function Contents({ children }) {
    return (
        <Container fluid className="flex-grow-1">
            <Row className="h-100">
                {/* 왼쪽 사이드 메뉴 */}
                <Col md={3} className="border-end p-3" style={{ height: '100%' }}>
                    <div className="d-flex h-100">
                        <MenuLayout />
                    </div>
                </Col>
                {/* 오른쪽 콘텐츠 */}
                <Col md={9} className="p-4" style={{ overflowY: 'auto' }}>
                    {children}
                </Col>
            </Row>
        </Container>
    );
}

export default Contents;
