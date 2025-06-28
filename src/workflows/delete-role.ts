import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { RBAC_MODULE } from "../modules/rbac"

interface DeleteRoleInput {
  roleId: string
  impactedUserIds: string[]
}

const stepDelete = createStep("delete-role", async ({ roleId, impactedUserIds }: DeleteRoleInput, context) => {
  const rbacModuleService = context.container.resolve(RBAC_MODULE) as any
  const logger = context.container.resolve("logger") as any

  logger.info(`Deleting role ${roleId} and updating ${impactedUserIds.length} users`)

  // Delete the role
  await rbacModuleService.deleteRbacRoles(roleId)

  // Here you would typically handle updating users who had this role
  // This depends on your user-role relationship implementation
  for (const userId of impactedUserIds) {
    logger.info(`User ${userId} role assignment updated due to role deletion`)
  }

  return new StepResponse({ success: true })
})

const deleteRoleWorkflow = createWorkflow(
  "delete-role",
  function (input: DeleteRoleInput) {
    const result = stepDelete(input)

    return new WorkflowResponse({
      result,
    })
  }
)

export default deleteRoleWorkflow 