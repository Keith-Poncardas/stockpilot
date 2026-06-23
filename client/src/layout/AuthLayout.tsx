import { Outlet } from "react-router-dom";
import AppLogo from "../components/AppLogo";

function AuthLayout() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
            <div className="w-full max-w-sm">

                <div className="flex justify-center mb-7">
                    <AppLogo size="sm" />
                </div>

                <div className="w-full max-w-sm">
                    {/* Card */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-9">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;