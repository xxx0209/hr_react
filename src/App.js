import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { AuthProvider } from "./context/AuthContext";
import { EnumProvider } from "./context/EnumContext"
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>        
        <EnumProvider>          
            <AppRoutes />          
        </EnumProvider>        
      </AuthProvider>
    </BrowserRouter>   
  );
}

export default App;
