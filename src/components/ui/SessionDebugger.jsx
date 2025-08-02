import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

const SessionDebugger = () => {
  const { user, isAuthenticated } = useAuth();
  const [debugHistory, setDebugHistory] = useState([]);

  useEffect(() => {
    const newEntry = {
      timestamp: new Date().toISOString(),
      user: user ? { 
        id: user._id || user.id, 
        role: user.role, 
        status: user.status,
        name: user.name 
      } : null,
      isAuthenticated: isAuthenticated,
    };

    setDebugHistory(prev => [...prev.slice(-9), newEntry]);
  }, [user, isAuthenticated]);

  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-sm text-xs z-50">
      <div className="font-bold mb-2">Session Debugger</div>
      <div className="space-y-1">
        <div>User: {user ? `${user.name} (${user.role})` : 'None'}</div>
        <div>Status: {user?.status || 'N/A'}</div>
        <div>Auth: {isAuthenticated ? '✅' : '❌'}</div>
      </div>
      <div className="mt-2 text-xs opacity-75">
        <div>History:</div>
        {debugHistory.map((entry, index) => (
          <div key={index} className={`p-2 rounded ${entry.isAuthenticated ? 'bg-green-800' : 'bg-red-800'}`}>
            <div>{new Date(entry.timestamp).toLocaleTimeString()}</div>
            <div>User: {entry.user ? `${entry.user.name} (${entry.user.role})` : 'None'}</div>
            <div>Auth: {entry.isAuthenticated ? '✅' : '❌'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionDebugger; 