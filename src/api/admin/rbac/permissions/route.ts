import type { 
  AuthenticatedMedusaRequest, 
  MedusaResponse 
} from "@medusajs/framework/http"
import { RBAC_MODULE } from "../../../../modules/rbac"
import createPermissionWorkflow from "../../../../workflows/create-permission"
import { CreatePermissionRequest } from "../../../../modules/rbac/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const rbacModuleService = req.scope.resolve(RBAC_MODULE) as any
  const [permissions, count] = await rbacModuleService.listAndCountRbacPermissions()
  
  res.json({
    permissions,
    count
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const result = await createPermissionWorkflow(req.scope).run({
    input: {
      permission: req.body as CreatePermissionRequest
    }
  })

  res.json(result.result)
} 