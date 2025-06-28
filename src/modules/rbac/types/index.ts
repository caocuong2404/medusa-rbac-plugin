export enum PermissionCategoryType {
  PREDEFINED = "predefined",
  CUSTOM = "custom",
}

export enum PermissionType {
  PREDEFINED = "predefined",
  CUSTOM = "custom",
}

export enum PermissionMatcherType {
  API = "api",
}

export enum ActionType {
  READ = "read",
  WRITE = "write",
  DELETE = "delete",
}

export enum PolicyType {
  DENY = "deny",
  ALLOW = "allow",
}

export interface CreateRoleRequest {
  name: string;
  policies: CreatePolicyRequest[];
}

export interface CreatePolicyRequest {
  permission: {
    id: string;
  };
  type: PolicyType;
}

export interface CreatePermissionRequest {
  name: string;
  type: PermissionType;
  matcherType: PermissionMatcherType;
  matcher: string;
  actionType: ActionType;
  category?: {
    id: string;
  };
}

export interface CreatePermissionCategoryRequest {
  name: string;
  type: PermissionCategoryType;
} 