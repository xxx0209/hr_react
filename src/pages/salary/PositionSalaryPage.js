import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Pagination } from "react-bootstrap";
import axios from "../../api/api";
import SelectCombo from "../../sample/SelectCombo";

function PositionSalaryPage() {
  const [salaries, setSalaries] = useState([]);
  const [positions, setPositions] = useState([]);
  const [show, setShow] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    positionId: "",
    title: "",
    baseSalary: "",
    hourlyRate: "",
    active: true,
  });

  // 페이징/검색 상태
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [searchPositionName, setSearchPositionName] = useState("");
  const [searchActive, setSearchActive] = useState(""); // "" | true | false

  useEffect(() => {
    fetchData();
  }, [page, size, searchPositionName, searchActive]);

  const fetchData = async () => {
    try {
      const [posRes, salaryRes] = await Promise.all([
        axios.get("/position/all"), // 직급 전체 조회
        axios.get("/api/position-salaries", {
          params: {
            page,
            size,
            positionName: searchPositionName || undefined,
            active:
              searchActive === ""
                ? undefined
                : searchActive === "true"
                ? true
                : false,
          },
        }),
      ]);
      setPositions(posRes.data);
      setSalaries(salaryRes.data.content);
      setTotalPages(salaryRes.data.totalPages);
    } catch (err) {
      console.error("데이터 로딩 실패", err);
      alert("데이터를 가져오는 중 오류가 발생했습니다.");
    }
  };

  const handleShow = (salary = null) => {
    if (salary) {
      setEditing(true);
      setFormData({
        id: salary.id,
        positionId: salary.positionId,
        title: salary.title,
        baseSalary: salary.baseSalary,
        hourlyRate: salary.hourlyRate,
        active: salary.active,
      });
    } else {
      setEditing(false);
      setFormData({
        id: "",
        positionId: "",
        title: "",
        baseSalary: "",
        hourlyRate: "",
        active: true,
      });
    }
    setShow(true);
  };

  const handleSave = async () => {
    if (!formData.positionId) {
      alert("직급을 선택해주세요!");
      return;
    }

    const payload = {
      positionId: formData.positionId,
      title: formData.title,
      baseSalary: formData.baseSalary,
      hourlyRate: formData.hourlyRate,
      active: formData.active,
    };

    try {
      if (editing) {
        await axios.put(`/api/position-salaries/${formData.id}`, payload);
      } else {
        await axios.post("/api/position-salaries", payload);
      }
      alert("등록/수정 되었습니다.");
      fetchData();
      setShow(false);
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("삭제하시겠습니까?")) {
      await axios.delete(`/api/position-salaries/${id}`);
      fetchData();
    }
  };

  const formatNumber = (num) => {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="container mt-4">
      <h3>직위별 급여 관리</h3>

      {/* 검색 필터 */}
      <div className="d-flex mb-3">
        <SelectCombo
          options={[
            { label: "전체 직급", value: "" },
            ...positions.map((p) => ({
              label: p.positionName,
              value: p.positionName,
            })),
          ]}
          value={searchPositionName}
          onChange={(v) => {
            setSearchPositionName(v);
            setPage(0);
          }}
          placeholder="직급 선택"
          searchable
        />
        <SelectCombo
          options={[
            { label: "전체", value: "" },
            { label: "활성", value: "true" },
            { label: "비활성", value: "false" },
          ]}
          value={searchActive}
          onChange={(v) => {
            setSearchActive(v);
            setPage(0);
          }}
          placeholder="활성/비활성"
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
            <th>직급명</th>
            <th>제목</th>
            <th>기본급</th>
            <th>시급</th>
            <th>활성</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {salaries.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                데이터가 없습니다
              </td>
            </tr>
          ) : (
            salaries.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.positionName}</td>
                <td>{s.title}</td>
                <td>{formatNumber(s.baseSalary)}원</td>
                <td>{formatNumber(s.hourlyRate)}원</td>
                <td>{s.active ? "활성" : "비활성"}</td>
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
     <div className="d-flex justify-content-center mt-3">
        <Pagination>
          <Pagination.First onClick={() => setPage(0)} disabled={page === 0} />
          <Pagination.Prev onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0} />

          {/* 페이지 번호 렌더링 */}
          {Array.from({ length: totalPages }, (_, idx) => (
            <Pagination.Item
              key={idx}
              active={idx === page}
              onClick={() => setPage(idx)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))} disabled={page + 1 >= totalPages} />
          <Pagination.Last onClick={() => setPage(totalPages - 1)} disabled={page + 1 >= totalPages} />
        </Pagination>
      </div>

      {/* 등록/수정 모달 */}
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "급여 수정" : "급여 등록"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>직급 선택</Form.Label>
              <SelectCombo
                options={positions.map((p) => ({
                  label: p.positionName,
                  value: p.positionId,
                }))}
                value={formData.positionId}
                onChange={(v) => setFormData({ ...formData, positionId: v })}
                searchable
                required
                placeholder="직급 선택"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>제목</Form.Label>
              <Form.Control
                type="text"
                placeholder="제목 입력"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
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

            <Form.Group className="mb-3">
              <Form.Label>활성 여부</Form.Label>
              <Form.Select
                value={formData.active ? "true" : "false"}
                onChange={(e) =>
                  setFormData({ ...formData, active: e.target.value === "true" })
                }
              >
                <option value="true">활성</option>
                <option value="false">비활성</option>
              </Form.Select>
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

export default PositionSalaryPage;
