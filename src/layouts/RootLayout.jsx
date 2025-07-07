import { Outlet } from "react-router";

function RootLayout() {
  return (
    <div>
      <h1>Root Layout</h1>
      <Outlet />
    </div>
  );
}

export default RootLayout;
