import type { TokenPayload } from "@/lib/auth";

export type StudentActionType = "book-exam" | "buy-exam";

type UserLike = Pick<TokenPayload, "role"> | null | undefined;

type UserRoleLike = TokenPayload["role"] | null | undefined;

const STUDENT_REGISTRATION_ROUTE = "/signup-student";
const STUDENT_DASHBOARD_ACTION_ROUTE = "/student/dashboard";

function isStudentRole(role: UserRoleLike) {
  return role === "student";
}

export function resolveStudentCtaTarget(user: UserLike, action: StudentActionType) {
  if (!isStudentRole(user?.role)) {
    return STUDENT_REGISTRATION_ROUTE;
  }

  switch (action) {
    case "book-exam":
    case "buy-exam":
    default:
      return STUDENT_DASHBOARD_ACTION_ROUTE;
  }
}

export function resolveStudentCtaTargetByRole(role: UserRoleLike, action: StudentActionType) {
  return resolveStudentCtaTarget(role ? { role } : null, action);
}
