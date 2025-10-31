## 🧪 테스트 실행 방법

### 1. 테스트 환경
- **언어**: JavaScript  
- **프레임워크**: React  
- **테스트 도구**: React Testing Library  
- **패키지 매니저**: npm  
- **IDE**: VS Code  

### 2. 테스트 실행 방법

#### ✅ 터미널에서 실행
```bash
npm test
```
> `npm test` 명령어는 `package.json`에 정의된 테스트 스크립트를 실행합니다. 기본적으로 Jest와 React Testing Library가 함께 동작합니다.

#### ✅ VS Code에서 실행
1. 테스트 파일(`*.test.js` 또는 `*.test.jsx`)을 열기  
2. 상단에 표시되는 ▶ 아이콘 클릭 → 해당 테스트 실행  
3. 결과는 하단의 **Terminal** 또는 **Test Results** 탭에서 확인 가능

### 3. 테스트 관련 정보
- 테스트 파일 위치: `src/__tests__/` 또는 각 컴포넌트 폴더 내  
- 테스트 프레임워크: **Jest**  
- UI 테스트 도구: **React Testing Library**  
- 커버리지 확인:
```bash
npm test -- --coverage