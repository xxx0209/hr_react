import React from 'react';
import './index.css';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import { EnumProvider } from "./context/EnumContext"
import AppRoutes from './routes/AppRoutes';

// function App() {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <EnumProvider>
//           <h1>Welcome to my app!</h1> {/* ✅ 테스트용 텍스트 */}
//           <AppRoutes />
//         </EnumProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }


// export default App;

function App() {
  return <div>React App</div>;
}

export default App;


