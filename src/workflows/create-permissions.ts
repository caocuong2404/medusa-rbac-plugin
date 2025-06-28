import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { RBAC_MODULE } from "../modules/rbac"
import { CreatePermissionRequest } from "../modules/rbac/types"

interface CreatePermissionsInput {
  permissions: CreatePermissionRequest[]
}

const stepCreateMultiple = createStep("create-multiple", async ({ permissions }: CreatePermissionsInput, context) => {
  const rbacModuleService = context.container.resolve(RBAC_MODULE) as any
  const logger = context.container.resolve("logger") as any

  logger.info(`Creating ${permissions.length} permissions`)

  const createdPermissions: any[] = []

  for (const permission of permissions) {
    const results = await rbacModuleService.listAndCountRbacPermissions()
    const isPermissionExists = results[0].find(result => {
      return (
        result.matcher === permission.matcher &&
        result.matcherType === permission.matcherType &&
        result.actionType === permission.actionType
      )
    })

    if (!isPermissionExists) {
      const rbacPermission = await rbacModuleService.createRbacPermissions({
        ...permission,
        policies: [],
        category: permission.category?.id
      })

      if (rbacPermission) {
        createdPermissions.push(rbacPermission)
      }
    } else {
      logger.warn(`Permission already exists: ${JSON.stringify(permission)}`)
    }
  }

  return new StepResponse(createdPermissions)
})

const createPermissionsWorkflow = createWorkflow(
  "create-permissions",
  function (input: CreatePermissionsInput) {
    const result = stepCreateMultiple(input)

    return new WorkflowResponse({
      permissions: result,
    })
  }
)

export default createPermissionsWorkflow 