import React, { useState } from "react";
import SelectCombo from "./SelectCombo";
import RadioGroup from "./RadioGroup";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App() {
  const opts = [
    { value: "kor", label: "한국어" },
    { value: "eng", label: "English" },
    { value: "jpn", label: "日本語" },
    " 기타 ",
  ];

    const opts2 = [
    { value: "kor", label: "한국어" },
    { value: "eng", label: "English" },
    { value: "jpn", label: "日本語" },
    " 기타 ",
  ];

  const [gender, setGender] = useState("");
  const [roles, setRoles] = useState([]);

  const [single, setSingle] = useState("");
  const [multi, setMulti] = useState([]);

  return (
    <>
    <div style={{ padding: 24 }}>
      <h4>Single (searchable)</h4>
      <SelectCombo
        label="언어 선택"
        options={opts}
        value={single}
        onChange={(v) => setSingle(v)}
        searchable={true}
      />

      <hr />

      <h4>Multiple</h4>
      <SelectCombo
        label="관심 분야"
        // options={["react", "spring", "docker", "k8s"]}
        options={opts}
        value={multi}
        onChange={(v) => setMulti(v)}
        multiple={true}
        searchable={true}
      />

      <hr />
      <div>
        <strong>값</strong>
        <pre>single: {JSON.stringify(single)}</pre>
        <pre>multi: {JSON.stringify(multi)}</pre>
      </div>
    </div>

        <div className="container mt-5">
      <h2>회원 정보</h2>

      <div className="mb-3">
        <RadioGroup
          label="성별"
          options={[
            { value: "MALE", label: "남성" },
            { value: "FEMALE", label: "여성" },
          ]}
          value={gender}
          onChange={setGender}
        />
      </div>

      <div className="mb-3">
        <RadioGroup
          label="권한 선택 (멀티)"
          options={[
            { value: "USER", label: "사용자" },
            { value: "ADMIN", label: "관리자" },
            { value: "SUPER", label: "슈퍼관리자" },
          ]}
          multiple
          value={roles}
          onChange={setRoles}
        />
      </div>

      <div>
        <strong>선택된 성별:</strong> {gender}
      </div>
      <div>
        <strong>선택된 권한:</strong> {roles.join(", ")}
      </div>
    </div>
    </>
  );
}
