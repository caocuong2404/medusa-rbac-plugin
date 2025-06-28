import RbacModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const RBAC_MODULE = "rbacModuleService"

export default Module(RBAC_MODULE, {
  service: RbacModuleService,
}) 