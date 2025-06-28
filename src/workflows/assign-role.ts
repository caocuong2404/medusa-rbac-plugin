import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { RBAC_MODULE } from "../modules/rbac"

interface AssignRoleInput {
  userId: string
  roleId: string
}

const stepAssignRole = createStep("assign-role", async ({ userId, roleId }: AssignRoleInput, context) => {
  const rbacModuleService = context.container.resolve(RBAC_MODULE) as any
  const logger = context.container.resolve("logger") as any

  logger.info(`Assigning role ${roleId} to user ${userId}`)

  // This would typically create a user-role relationship
  // Implementation depends on your user-role link setup
  await rbacModuleService.assignRoleToUser(userId, roleId)

  return new StepResponse({ success: true, userId, roleId })
})

const assignRoleWorkflow = createWorkflow(
  "assign-role",
  function (input: AssignRoleInput) {
    const result = stepAssignRole(input)

    return new WorkflowResponse({
      result,
    })
  }
)

export default assignRoleWorkflow 