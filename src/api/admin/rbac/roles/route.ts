import type { 
  AuthenticatedMedusaRequest, 
  MedusaResponse 
} from "@medusajs/framework/http"
import { RBAC_MODULE } from "../../../../modules/rbac"
import deleteRoleWorkflow from "../../../../workflows/delete-role"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { CreateRoleRequest } from "../../../../modules/rbac/types"

export const GET = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: rolesWithUsers } = await query.graph({
    entity: "rbac_role",
    fields: [
      "*",
      "policies.*",
      "policies.permission.*",
      "users.*",
    ],
  })

  res.json(rolesWithUsers)
}

export const POST = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const rbacModuleService = req.scope.resolve(RBAC_MODULE) as any
  const newRole = await rbacModuleService.addRole(req.body as CreateRoleRequest)
  res.json(newRole)
}

export const DELETE = async (
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) => {
  const deleteRole = req.body as { id: string }
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: [roleWithUsers] } = await query.graph({
    entity: "rbac_role",
    filters: {
      id: [deleteRole.id]
    },
    fields: [
      "*",
      "users.*",
    ],
  })

  await deleteRoleWorkflow(req.scope).run({
    input: {
      roleId: deleteRole.id,
      impactedUserIds: roleWithUsers.users.map((user: any) => user.id)
    }
  })

  res.json({})
} 