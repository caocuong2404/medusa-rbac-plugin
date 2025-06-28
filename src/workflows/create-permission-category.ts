import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { RBAC_MODULE } from "../modules/rbac"
import { CreatePermissionCategoryRequest } from "../modules/rbac/types"

interface CreatePermissionCategoryInput {
  category: CreatePermissionCategoryRequest
}

const stepCreateCategory = createStep("create-category", async ({ category }: CreatePermissionCategoryInput, context) => {
  const rbacModuleService = context.container.resolve(RBAC_MODULE) as any
  const logger = context.container.resolve("logger") as any

  logger.info(`Creating permission category: ${JSON.stringify(category)}`)

  const rbacCategory = await rbacModuleService.createRbacPermissionCategories(category)

  if (rbacCategory) {
    return new StepResponse(rbacCategory)
  }

  logger.error(`Permission category has NOT been created`)
  return new StepResponse(undefined)
})

const createPermissionCategoryWorkflow = createWorkflow(
  "create-permission-category",
  function (input: CreatePermissionCategoryInput) {
    const result = stepCreateCategory(input)

    return new WorkflowResponse({
      category: result,
    })
  }
)

export default createPermissionCategoryWorkflow 