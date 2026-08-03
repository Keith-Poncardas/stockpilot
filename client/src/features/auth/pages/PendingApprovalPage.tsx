import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { RefreshCw, UserCheck } from "lucide-react";
import { useApolloClient, useLazyQuery } from "@apollo/client";
import { ME_QUERY } from "../operations";
import { UserRole, UserStatus } from "@/features/user/user.constants";
import { useEffect } from "react";

export function PendingApprovalPage() {
    const navigate = useNavigate();
    const { user, login, logout, token } = useAuthStore();
    const client = useApolloClient();

    useEffect(() => {
        if (user?.status === UserStatus.ACTIVE && user?.role !== UserRole.UNASSIGNED) {
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    const [refreshUser, { loading: isRefreshing }] = useLazyQuery(ME_QUERY, {
        fetchPolicy: "network-only",
        onCompleted: (data) => {
            if (data?.me && token) {
                login(data.me, token, false);
            }
        },
        onError: (error) => {
            console.error("Failed to refresh status", error);
        }
    });

    const handleRefresh = () => {
        if (isRefreshing) return;
        refreshUser();
    };

    const handleLogout = () => {
        logout();
        client.clearStore();
        navigate("/login", { replace: true });
    };

    return (
        <>
            <EmptyState
                title="Waiting for Approval"
                description="Please wait for an administrator to activate your account or assign a role to you."
                icon={UserCheck}
                className="h-auto"
                action={
                    <div className="flex flex-col items-center gap-3">
                        <Button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="group bg-amber-400 hover:bg-amber-500 text-black font-semibold transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : 'transition-transform duration-500 group-hover:rotate-180'}`} />
                            Refresh Status
                        </Button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Sign out
                        </button>
                    </div>
                }
            />
        </>
    );
}
