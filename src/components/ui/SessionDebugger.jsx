import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const SessionDebugger = ({ label = 'Session Monitor' }) => {
  const { user, token, isAuthenticated } = useAuth();
  const [sessionLog, setSessionLog] = useState([]);

  useEffect(() => {
    const logSession = () => {
      const timestamp = new Date().toISOString();
      const sessionState = {
        timestamp,
        hasUser: !!user,
        hasToken: !!token,
        isAuthenticated: isAuthenticated(),
        userId: user?._id || user?.id,
        userEmail: user?.email,
        localStorageUser: !!localStorage.getItem("bloodDonation_user"),
        localStorageToken: !!localStorage.getItem("bloodDonation_token")
      };
      
      setSessionLog(prev => [sessionState, ...prev.slice(0, 9)]); // Keep last 10 entries
    };

    logSession(); // Initial log
    
    const interval = setInterval(logSession, 2000); // Log every 2 seconds
    
    return () => clearInterval(interval);
  }, [user, token, isAuthenticated]);

  if (process.env.NODE_ENV === 'production') {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md text-xs z-50">
      <h4 className="font-bold mb-2">{label}</h4>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {sessionLog.map((entry, index) => (
          <div key={index} className={`p-2 rounded ${entry.isAuthenticated ? 'bg-green-800' : 'bg-red-800'}`}>
            <div className="font-mono">
              {entry.timestamp.split('T')[1].split('.')[0]}
            </div>
            <div>
              User: {entry.hasUser ? '✅' : '❌'} | 
              Token: {entry.hasToken ? '✅' : '❌'} | 
              Auth: {entry.isAuthenticated ? '✅' : '❌'}
            </div>
            <div>
              LS User: {entry.localStorageUser ? '✅' : '❌'} | 
              LS Token: {entry.localStorageToken ? '✅' : '❌'}
            </div>
            {entry.userId && <div>ID: {entry.userId.substring(0, 8)}...</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionDebugger; 