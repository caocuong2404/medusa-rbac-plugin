import type { 
  AuthenticatedMedusaRequest, 
  MedusaResponse 
} from "@medusajs/framework/http"
import { RBAC_MODULE } from "../../../../../modules/rbac"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const rbacModuleService = req.scope.resolve(RBAC_MODULE) as any
  
  const permission = await rbacModuleService.retrieveRbacPermission(id, {
    relations: ["category", "policies"]
  })
  
  res.json(permission)
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const { id } = req.params
  const rbacModuleService = req.scope.resolve(RBAC_MODULE) as any
  
  await rbacModuleService.deleteRbacPermissions(id)
  
  res.json({ success: true })
} 