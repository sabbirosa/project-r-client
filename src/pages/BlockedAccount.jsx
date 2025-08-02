import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

const BlockedAccount = () => {
  const location = useLocation();
  const from = location.state?.from || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full mx-4">
        <div className="text-center p-8">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Account Blocked
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your account has been blocked by an administrator. Please contact support for assistance.
          </p>
          
          <div className="space-y-3">
            <Button
              onClick={() => window.location.href = "mailto:support@project-r.com"}
              className="w-full"
              variant="primary"
            >
              Contact Support
            </Button>
            
            <Button
              onClick={() => window.location.href = "/"}
              className="w-full"
              variant="outline"
            >
              Go to Home
            </Button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>If you believe this is an error, please contact our support team.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BlockedAccount; 