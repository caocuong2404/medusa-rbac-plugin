import type { 
  AuthenticatedMedusaRequest, 
  MedusaResponse 
} from "@medusajs/framework/http"
import { RBAC_MODULE } from "../../../../modules/rbac"
import { PermissionMatcherType, ActionType } from "../../../../modules/rbac/types"

interface CheckRequest {
  userId: string
  matcher: string
  matcherType: PermissionMatcherType
  actionType: ActionType
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const rbacModuleService = req.scope.resolve(RBAC_MODULE) as any
  const { userId, matcher, matcherType, actionType } = req.body as CheckRequest
  
  // This would typically get the user's role from the link
  // For now, we'll assume a role is passed or retrieved from user context
  // You'll need to implement the user-role relationship
  
  try {
    // Mock implementation - you'll need to implement actual user-role lookup
    const userRole = { id: "default-role" } // This should come from the link
    
    const isAuthorized = await rbacModuleService.evaluateAuthorization(
      userRole,
      matcherType,
      matcher,
      actionType
    )
    
    res.json({
      authorized: isAuthorized,
      userId,
      matcher,
      matcherType,
      actionType
    })
  } catch (error) {
    res.status(500).json({
      error: "Authorization check failed",
      message: error.message
    })
  }
} 