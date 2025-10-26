import axios from "../api/api";
import { useContext, useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { EnumContext } from "../context/EnumContext";
import RadioGroup from "../sample/RadioGroup";

const SignupPage = () => {

    const enums = useContext(EnumContext);    

    const navigate = useNavigate();

    //폼 데이터 state 정의
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        password: "",
        confirmPassword: "",
        email: "",
        gender: enums?.Gender[0]?.value,
        address: ""
    });

    const [isAvailable, setIsAvailable] = useState(null); // null: 확인 전, true: 사용 가능, false: 중복

    //폼 유효성 검사(Form Validation Check) 관련 state 정의 : 입력 양식에 문제 발생시 값을 저장할 곳
    const [errors, setErrors] = useState({
        id: '', name: '', password: '', confirmPassword: '', email: '', gender: '', address: '', general: ''
    });

    const handleCheckDuplicate = async () => {
        console.log("중복 확인 클릭됨:", formData.id);
        if (formData.id.trim() === "") {
            setErrors(prevErrors => ({
                ...prevErrors,
                id: "아이디가 비어있습니다"
            }));
            return;
        }

        try {
            const response = await axios.post('/member/checkId', { id: formData.id });

            if (response.data.available) {
                setIsAvailable(true);
                setErrors(prev => ({ ...prev, id: '' })); // 오류 초기화
            } else {
                setIsAvailable(false);
                setErrors(prev => ({ ...prev, id: '이미 사용 중인 아이디입니다.' }));
            }
        } catch (error) {
            console.error('중복 확인 실패:', error);
            setIsAvailable(null);
            setErrors(prev => ({ ...prev, id: '중복 확인 중 오류가 발생했습니다.' }));
        }

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        handleCheckDuplicate();

        if (!isAvailable) {
            setErrors(prevErrors => ({
                ...prevErrors,
                id: "아이디 중복 확인을 해주세요."
            }));
        }

        const newErrors = {};

        for (const key in formData) {
            if (formData[key].trim() === "") {
                newErrors[key] = '입력해주세요.';
            } else {
                if (key === 'confirmPassword') {
                    if (formData['password'] !== formData[key]) {
                        newErrors[key] = '비밀번호가 일치하지 않습니다.';
                    }
                }
            }
        }
        setErrors(newErrors);

        const submitFlag = Object.values(errors).every(error => error === '');
        if (!submitFlag) {
            return;
        }

        const url = '/member/signup';
        const parameters = formData;

        try {

            const response = await axios.post(url, parameters);

            if (response.status === 200) { // 스프링의 MemberController 파일 참조
                alert("회원가입이 완료되었습니다!");
                navigate('/login');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                // 서버에서 받은 오류 정보를 객체로 저장합니다.
                setErrors(error.response.data);
            } else { // 입력 값 이외에 발생하는 다른 오류와 관련됨.
                setErrors((previous) => ({ ...previous, general: '회원 가입 중에 오류가 발생하였습니다.' }));
            }
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
        >
            <Row
                style={{
                    width: "500px",
                    minHeight: "600px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    padding: "30px",
                }}
            >
                <Col>
                    {/* 상단 타이틀 */}
                    <h2 style={{ fontWeight: "700", marginBottom: "10px" }}>회원가입</h2>
                    <p style={{ color: "#555", marginBottom: "30px" }}>
                        가입을 통해 더 다양한 서비스를 만나보세요.
                    </p>

                    {errors.general && <Alert variant="danger">{errors.general}</Alert>}
                    {/* 회원가입 폼 */}
                    <Form onSubmit={handleSubmit}>
                        {/* 아이디 입력 + 중복 확인 버튼 */}
                        <Form.Group controlId="formid" className="mb-3">
                            <Form.Label>ID</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="회원아이디"
                                    value={formData.id}
                                    onChange={(e) => {
                                        setFormData({ ...formData, id: e.target.value });
                                        setIsAvailable(null); // 입력 바뀌면 중복 확인 초기화
                                        setErrors(prevErrors => ({ ...prevErrors, id: "" }));  // 오류 초기화
                                    }}
                                    isInvalid={!!errors.id}
                                />
                                <Button variant="secondary" onClick={handleCheckDuplicate}>
                                    중복 확인
                                </Button>
                                <Form.Control.Feedback type="invalid">
                                    {errors.id}
                                </Form.Control.Feedback>
                            </InputGroup>
                            {isAvailable === true && (
                                <Form.Text style={{ color: "green" }}>사용 가능한 아이디입니다.</Form.Text>
                            )}
                            {isAvailable === false && (
                                <Form.Text style={{ color: "red" }}>이미 사용 중인 아이디입니다.</Form.Text>
                            )}

                        </Form.Group>

                        <Form.Group controlId="formName" className="mb-3">
                            <Form.Label>이름</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="회원이름"
                                    value={formData.name}
                                    onChange={(e) => {
                                        setFormData({ ...formData, name: e.target.value });
                                        setErrors(prevErrors => ({ ...prevErrors, name: "" }));  // 오류 초기화
                                    }}
                                    isInvalid={!!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name}
                                </Form.Control.Feedback>
                            </InputGroup>
                        </Form.Group>

                        {/* 비밀번호 */}
                        <Form.Group controlId="formPassword" className="mb-3">
                            <Form.Label>비밀번호<br />
                                <span style={{ fontSize: "0.8em", color: "gray" }}>
                                    (대문자 포함 8자리 이상, 특수 문자 '!@#$%' 중 하나 이상 포함)
                                </span>
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="비밀번호 입력"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    setErrors(prevErrors => ({ ...prevErrors, password: "" }));
                                }}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* 비밀번호 확인 */}
                        <Form.Group controlId="formPasswordConfirm" className="mb-3">
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="비밀번호 확인"
                                value={formData.confirmPassword}
                                onChange={(e) => {
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                    setErrors(prevErrors => ({ ...prevErrors, confirmPassword: "" }));
                                }}
                                isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.confirmPassword}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* 이메일 */}
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>이메일</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="이메일 입력"
                                value={formData.email}
                                onChange={(e) => {
                                    setFormData({ ...formData, email: e.target.value });
                                    setErrors(prevErrors => ({ ...prevErrors, email: "" }));
                                }}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formGender" className="mb-3">                            
                            <div className="mb-3">
                                <RadioGroup
                                  label="성별"
                                  options={enums?.Gender || []}
                                  value={formData.gender}                                  
                                  onChange={(e) => setFormData({ ...formData, gender: e })}
                                />
                            </div>
                            {/* <div>
                                <Form.Check
                                    inline
                                    label="남"
                                    name="gender"
                                    type="radio"
                                    id="genderMale"
                                    value="male"
                                    checked={formData.gender === "male"}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                />
                                <Form.Check
                                    inline
                                    label="여"
                                    name="gender"
                                    type="radio"
                                    id="genderFemale"
                                    value="female"
                                    checked={formData.gender === "female"}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                />
                            </div> */}
                        </Form.Group>

                        {/* 주소 */}
                        <Form.Group controlId="formAddress" className="mb-4">
                            <Form.Label>주소</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="주소입력"
                                value={formData.address}
                                onChange={(e) => {
                                    setFormData({ ...formData, address: e.target.value });
                                    setErrors(prevErrors => ({ ...prevErrors, address: "" }));
                                }}
                                isInvalid={!!errors.address}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.address}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {/* 가입하기 버튼 */}
                        <Button
                            variant="primary"
                            type="submit"
                            style={{ width: "100%", backgroundColor: "#007bff", borderColor: "#007bff" }}
                        >
                            가입하기
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default SignupPage;
