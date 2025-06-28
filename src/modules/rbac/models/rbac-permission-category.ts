import { model } from "@medusajs/framework/utils"
import { PermissionCategoryType } from "../types"

const RbacPermissionCategory = model.define("rbac_permission_category", {
  id: model.id().primaryKey(),
  name: model.text(),
  type: model.enum(PermissionCategoryType),
  permissions: model.hasMany(() => require("./rbac-permission").default, {
    mappedBy: "category"
  })
}).cascades({
  delete: ["permissions"],
})

export default RbacPermissionCategory 