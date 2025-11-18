---

## 📘 TypeScript 도입 가이드: `App.js` → `App.tsx`

### 1. 왜 TypeScript를 도입해야 하나요?

- ✅ **오류 예방**: 컴파일 단계에서 오류를 잡아줌
- ✅ **자동완성 강화**: IDE에서 더 똑똑한 추천 제공
- ✅ **협업 효율 증가**: 타입 기반 문서화로 소통 원활
- ✅ **리팩토링 안정성**: 대규모 수정에도 오류 최소화

---

### 2. `App.js` vs `App.tsx` 비교

| 항목 | `App.js` | `App.tsx` |
|------|----------|-----------|
| 언어 | JavaScript | TypeScript |
| 확장자 | `.js` | `.tsx` |
| 타입 지원 | 없음 | 있음 (`interface`, `type`) |
| 안정성 | 낮음 | 높음 |
| 개발 경험 | 빠름 | 안전함 |

---

### 3. `App.tsx` 예시 코드

```tsx
import React from 'react';

interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

const App: React.FC = () => {
  const user: User = {
    id: 1,
    name: '승규',
    isAdmin: true,
  };

  const greetUser = (name: string): string => {
    return `안녕하세요, ${name}님!`;
  };

  return (
    <div>
      <h1>{greetUser(user.name)}</h1>
      {user.isAdmin && <p>관리자 권한이 있습니다.</p>}
    </div>
  );
};

export default App;
```

---

### 4. TypeScript 기초 문법 요약

```ts
// 기본 타입
let name: string = '승규';
let age: number = 28;
let isAdmin: boolean = true;

// 배열
let tags: string[] = ['react', 'typescript'];

// 객체 타입
interface User {
  id: number;
  name: string;
  isAdmin: boolean;
}

// 함수 타입
function greet(name: string): string {
  return `안녕하세요, ${name}님!`;
}
```

---

### 5. 팀원 적응을 위한 팁

- `App.tsx`에 간단한 주석 추가
- `README.md`에 타입스크립트 기초 링크 포함
- 초반엔 `any` 타입으로 유연하게 시작
- 코드 리뷰 시 타입 관련 피드백 공유

---