import { MedusaService } from "@medusajs/framework/utils"
import RbacRole from "./models/rbac-role"
import RbacPermission from "./models/rbac-permission"
import RbacPolicy from "./models/rbac-policy"
import RbacPermissionCategory from "./models/rbac-permission-category"
import { 
  CreateRoleRequest, 
  PermissionMatcherType, 
  ActionType, 
  PolicyType,
  CreatePermissionRequest,
  CreatePermissionCategoryRequest
} from "./types"

class RbacModuleService extends MedusaService({
  RbacRole,
  RbacPolicy,
  RbacPermission,
  RbacPermissionCategory
}) {
  private logger_: any
  private options_: any

  constructor({ logger }, options) {
    super(...arguments)
    this.logger_ = logger
    this.options_ = options || {}
  }

  async addRole(adminRbacRole: CreateRoleRequest) {
    const newRole = await this.createRbacRoles({
      name: adminRbacRole.name,
      policies: []
    })

    if (newRole) {
      const newPolicies = await this.createRbacPolicies(
        adminRbacRole.policies.map(policy => {
          return {
            permission: policy.permission.id,
            type: policy.type,
            role: newRole.id
          }
        })
      )

      return {
        ...newRole,
        policies: newPolicies
      }
    }
    return undefined
  }

  evaluatePolicy(policy: any, requestedType: PermissionMatcherType, matcher: string, actionType: ActionType) {
    if (policy.permission.matcherType === requestedType) {
      if (requestedType === PermissionMatcherType.API) {
        // It covers subroutes also
        if (matcher.includes(policy.permission.matcher) && policy.permission.actionType === actionType) {
          return policy.type
        }
      } else {
        if (policy.permission.matcherType === requestedType && 
            policy.permission.matcher === matcher && 
            policy.permission.actionType === actionType) {
          return policy.type
        }
      }
    }
    return undefined
  }

  async evaluateAuthorization(role: any, requestedType: PermissionMatcherType, matcher: string, actionType: ActionType) {
    const rbacRole = await this.retrieveRbacRole(role.id, {
      relations: ["policies", "policies.permission"]
    })

    for (const configuredPolicy of rbacRole.policies) {
      if (this.evaluatePolicy(configuredPolicy, requestedType, matcher, actionType) === PolicyType.DENY) {
        return false
      }
    }
    return true
  }

  async testAuthorization(role: any, requestedType: PermissionMatcherType, matcher: string) {
    const rbacRole = await this.retrieveRbacRole(role.id, {
      relations: ["policies", "policies.permission"]
    })

    const allowedActions: ActionType[] = []
    const deniedActions: ActionType[] = []

    for (const configuredPolicy of rbacRole.policies) {
      for (const actionType of Object.values(ActionType)) {
        if (this.evaluatePolicy(configuredPolicy, requestedType, matcher, actionType) === PolicyType.DENY) {
          deniedActions.push(actionType)
        } else {
          allowedActions.push(actionType)
        }
      }
    }

    return {
      url: matcher,
      denied: deniedActions,
      allowed: allowedActions
    }
  }

  async createPermission(permission: CreatePermissionRequest) {
    const results = await this.listAndCountRbacPermissions()
    const isPermissionExists = results[0].find(result => {
      return (
        result.matcher === permission.matcher &&
        result.matcherType === permission.matcherType &&
        result.actionType === permission.actionType
      )
    })

    if (isPermissionExists) {
      this.logger_.error(`Permission has NOT been created. It already exists.`)
      return undefined
    }

    this.logger_.info(`Rbac permission to create: ${JSON.stringify(permission)}`)
    
    const rbacPermission = await this.createRbacPermissions({
      ...permission,
      policies: [],
      category: permission.category?.id
    })

    if (rbacPermission) {
      return rbacPermission
    }
    
    this.logger_.error(`Permission has NOT been created`)
    return undefined
  }

  async createPermissionCategory(category: CreatePermissionCategoryRequest) {
    return await this.createRbacPermissionCategories(category)
  }

  async deleteRole(roleId: string) {
    return await this.deleteRbacRoles(roleId)
  }

  async assignRoleToUser(userId: string, roleId: string) {
    // This would typically be handled by the user-role link
    // Implementation depends on how user-role relationship is managed
    this.logger_.info(`Assigning role ${roleId} to user ${userId}`)
  }
}

export default RbacModuleService 