import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children,user }: { children: React.ReactNode ,user:any}) => {
  
  if (!user) return <Navigate to="/login" />;
  else return children;
};

export default ProtectedRoute;
