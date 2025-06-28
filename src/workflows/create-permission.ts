import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { RBAC_MODULE } from "../modules/rbac"
import { CreatePermissionRequest } from "../modules/rbac/types"

interface CreatePermissionInput {
  permission: CreatePermissionRequest
}

const stepCreate = createStep("create", async ({ permission }: CreatePermissionInput, context) => {
  const rbacModuleService = context.container.resolve(RBAC_MODULE) as any
  const logger = context.container.resolve("logger") as any

  const results = await rbacModuleService.listAndCountRbacPermissions()
  const isPermissionExists = results[0].find(result => {
    return (
      result.matcher === permission.matcher &&
      result.matcherType === permission.matcherType &&
      result.actionType === permission.actionType
    )
  })

  if (isPermissionExists) {
    logger.error(`Permission has NOT been created. It already exists.`)
    return new StepResponse(undefined)
  }

  logger.info(`Rbac permission to create: ${JSON.stringify(permission)}`)

  const rbacPermission = await rbacModuleService.createRbacPermissions({
    ...permission,
    policies: [],
    category: permission.category?.id
  })

  if (rbacPermission) {
    return new StepResponse(rbacPermission)
  }

  logger.error(`Permission has NOT been created`)
  return new StepResponse(undefined)
})

const createPermissionWorkflow = createWorkflow(
  "create-permission",
  function (input: CreatePermissionInput) {
    const result = stepCreate(input)

    return new WorkflowResponse({
      permission: result,
    })
  }
)

export default createPermissionWorkflow 