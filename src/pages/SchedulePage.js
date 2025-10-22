// ScheduleCalendarWithForm.js
import React, { useState, useRef } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function ScheduleCalendarWithForm() {
    const [events, setEvents] = useState([
        { id: 1, title: '회의', start: new Date().toISOString().split('T')[0] }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const calendarRef = useRef(null);

    const handleDateClick = (arg) => {
        setSelectedDate(arg.dateStr);
        setNewTitle('');
        setShowModal(true);
    };

    const handleSaveEvent = () => {
        setEvents([
            ...events,
            { id: events.length + 1, title: newTitle, start: selectedDate }
        ]);
        setShowModal(false);
    };

    return (
        <Container className="my-5">
            <Row className="mb-3">
                <Col><h3>📅 스케줄 달력</h3></Col>
            </Row>
            <Row>
                <Col md={9}>
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        dateClick={handleDateClick}
                    />
                </Col>
                <Col md={3}>
                    <Card className="p-3">
                        <h5>등록된 스케줄</h5>
                        <hr />
                        {events.map(ev => (
                            <p key={ev.id}>{ev.start}: {ev.title}</p>
                        ))}
                    </Card>
                </Col>
            </Row>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>새 스케줄 등록</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formDate">
                            <Form.Label>날짜</Form.Label>
                            <Form.Control type="text" value={selectedDate} readOnly />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTitle">
                            <Form.Label>제목</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="스케줄 제목 입력"
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>취소</Button>
                    <Button variant="primary" onClick={handleSaveEvent}>저장</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );

}

export default ScheduleCalendarWithForm;