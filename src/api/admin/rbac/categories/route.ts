import type { 
  AuthenticatedMedusaRequest, 
  MedusaResponse 
} from "@medusajs/framework/http"
import { RBAC_MODULE } from "../../../../modules/rbac"
import createPermissionCategoryWorkflow from "../../../../workflows/create-permission-category"
import { CreatePermissionCategoryRequest } from "../../../../modules/rbac/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const rbacModuleService = req.scope.resolve(RBAC_MODULE) as any
  const [categories, count] = await rbacModuleService.listAndCountRbacPermissionCategories()
  
  res.json({
    categories,
    count
  })
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const result = await createPermissionCategoryWorkflow(req.scope).run({
    input: {
      category: req.body as CreatePermissionCategoryRequest
    }
  })

  res.json(result.result)
} 