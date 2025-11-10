import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form } from "react-bootstrap";
import axios from "../../api/api";
import SelectCombo from "../../sample/SelectCombo";

function MemberSalaryPage() {
  const [memberSalaries, setMemberSalaries] = useState([]);
  const [members, setMembers] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    memberId: "",
    memberName: "",
    baseSalary: "",
    hourlyRate: "",
  });

  // 페이징/검색 상태
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, [page, size, search]);

  const fetchData = async () => {
    try {
      const [memberRes, salaryRes] = await Promise.all([
        axios.get("/member/list"),
        axios.get("/api/member-salaries", {
          params: { page, size, search },
        }),
      ]);
      setMembers(memberRes.data);
      setMemberSalaries(salaryRes.data.content);
      setTotalPages(salaryRes.data.totalPages);
    } catch (error) {
      console.error(error);
      alert("데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const handleShow = (salary = null) => {
    if (salary) {
      setEditing(true);
      setFormData({
        id: salary.id,
        memberId: salary.memberId,
        memberName: salary.memberName,
        baseSalary: salary.baseSalary,
        hourlyRate: salary.hourlyRate,
      });
    } else {
      setEditing(false);
      setFormData({
        id: "",
        memberId: "",
        memberName: "",
        baseSalary: "",
        hourlyRate: "",
      });
    }
    setShow(true);
  };

  const handleSave = async () => {
    if (!formData.memberId) {
      alert("회원을 선택해주세요!");
      return;
    }

    const payload = {
      memberId: formData.memberId,
      baseSalary: formData.baseSalary,
      hourlyRate: formData.hourlyRate,
    };

    try {
      if (editing) {
        await axios.put(`/api/member-salaries/${formData.id}`, payload);
      } else {
        await axios.post("/api/member-salaries", payload);
      }
      alert("저장되었습니다.");
      fetchData();
      setShow(false);
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      try {
        await axios.delete(`/api/member-salaries/${id}`);
        fetchData();
      } catch (error) {
        console.error(error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container mt-4">
      <h3>회원별 기본급 관리</h3>

      {/* 검색 필터 */}
      <div className="d-flex mb-3">
        <SelectCombo
          options={members.map((m) => ({ label: m.memberName, value: m.memberId }))}
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(0);
          }}
          placeholder="회원 선택"
          searchable
        />
        <Button className="ms-2" onClick={fetchData}>
          검색
        </Button>
      </div>

      <Button className="mb-3" onClick={() => handleShow()}>
        + 급여 등록
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>회원명</th>
            <th>기본급</th>
            <th>시급</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {memberSalaries.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                데이터가 없습니다
              </td>
            </tr>
          ) : (
            memberSalaries.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.memberName}</td>
                <td>{formatNumber(s.baseSalary)}원</td>
                <td>{formatNumber(s.hourlyRate)}원</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShow(s)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(s.id)}
                  >
                    삭제
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* 페이징 */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          페이지 {page + 1} / {totalPages}
        </div>
        <div>
          <Button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="me-2"
          >
            이전
          </Button>
          <Button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            다음
          </Button>
        </div>
      </div>

      {/* 등록/수정 모달 */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "급여 수정" : "급여 등록"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>회원 선택</Form.Label>
              <SelectCombo
                options={members.map((m) => ({ label: m.memberName, value: m.memberId }))}
                value={formData.memberId}
                onChange={(v) => setFormData({ ...formData, memberId: v })}
                searchable
                placeholder="회원 선택"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>기본급</Form.Label>
              <Form.Control
                type="text"
                value={formatNumber(formData.baseSalary)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  if (!isNaN(rawValue)) {
                    setFormData({ ...formData, baseSalary: rawValue });
                  }
                }}
                placeholder="기본급 입력 (원)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>시급</Form.Label>
              <Form.Control
                type="text"
                value={formatNumber(formData.hourlyRate)}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/,/g, "");
                  if (!isNaN(rawValue)) {
                    setFormData({ ...formData, hourlyRate: rawValue });
                  }
                }}
                placeholder="시급 입력 (원)"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            닫기
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editing ? "수정 저장" : "등록"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MemberSalaryPage;
