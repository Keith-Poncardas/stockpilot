import { ApprovalStatus, AVAILABLE_ROLES, UserRole, UserStatus } from "@/features/user/user.constants";
import type { UserRowInfoCellProps } from "@/features/user/user.types";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { ASSIGN_ROLE } from "../../operations";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "./ActionCellContent";
import { getOptions } from "../../user.utils";
import { getRoleColor } from "@/lib/utils";
import { useAuthStore } from "@/store";

export function RoleCell({ row }: UserRowInfoCellProps) {
  const { user } = useAuthStore();
  const { mutate } = useOptimisticMutation();
  const { role, approvalStatus, status, id } = row.original;
  const isCurrentUser = user?.id === id;
  const isRoleDisabled =
    isCurrentUser ||
    status === UserStatus.TERMINATED ||
    role === UserRole.SUPER_ADMIN ||
    approvalStatus !== ApprovalStatus.APPROVED;

  const handleUpdate = async (newRole: UserRole) => {
    await mutate({
      mutation: ASSIGN_ROLE,
      typename: 'User',
      entityId: id,
      optimisticFields: { role: newRole },
      buildVariables: ({ role }) => ({
        input: { userId: id, role }
      }),
    });
  }

  const roleOptions = getOptions({
    items: AVAILABLE_ROLES,
    currentValue: role,
    getValue: role => role,
    getLabel: role => role.replace(/_/g, " "),
    getColor: role => getRoleColor(role),
    onUpdate: (val) => handleUpdate(val as UserRole),
  });

  return (
    <ActionPopover
      title="Update Role"
      options={roleOptions}
      disabled={isRoleDisabled}
    >
      <ActionCellContent
        label={role}
        approvalStatus={approvalStatus}
        isLocked={isRoleDisabled}
      />
    </ActionPopover>
  )
}