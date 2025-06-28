import { 
  PermissionType, 
  PermissionMatcherType, 
  ActionType, 
  PermissionCategoryType 
} from "../modules/rbac/types"

// Predefined permission categories
const categories = [
  {
    name: "Products",
    type: PermissionCategoryType.PREDEFINED
  },
  {
    name: "Orders", 
    type: PermissionCategoryType.PREDEFINED
  },
  {
    name: "Customers",
    type: PermissionCategoryType.PREDEFINED
  },
  {
    name: "Users",
    type: PermissionCategoryType.PREDEFINED
  },
  {
    name: "Settings",
    type: PermissionCategoryType.PREDEFINED
  },
  {
    name: "Analytics",
    type: PermissionCategoryType.PREDEFINED
  }
]

// Predefined permissions
const permissions = [
  // Products
  {
    name: "Read Products",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/products",
    actionType: ActionType.READ,
    category: "Products"
  },
  {
    name: "Write Products",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/products",
    actionType: ActionType.WRITE,
    category: "Products"
  },
  {
    name: "Delete Products",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/products",
    actionType: ActionType.DELETE,
    category: "Products"
  },
  
  // Orders
  {
    name: "Read Orders",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/orders",
    actionType: ActionType.READ,
    category: "Orders"
  },
  {
    name: "Write Orders",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/orders",
    actionType: ActionType.WRITE,
    category: "Orders"
  },
  {
    name: "Delete Orders",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/orders",
    actionType: ActionType.DELETE,
    category: "Orders"
  },
  
  // Customers
  {
    name: "Read Customers",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/customers",
    actionType: ActionType.READ,
    category: "Customers"
  },
  {
    name: "Write Customers",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/customers",
    actionType: ActionType.WRITE,
    category: "Customers"
  },
  {
    name: "Delete Customers",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/customers",
    actionType: ActionType.DELETE,
    category: "Customers"
  },
  
  // Users
  {
    name: "Read Users",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/users",
    actionType: ActionType.READ,
    category: "Users"
  },
  {
    name: "Write Users",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/users",
    actionType: ActionType.WRITE,
    category: "Users"
  },
  {
    name: "Delete Users",
    type: PermissionType.PREDEFINED,
    matcherType: PermissionMatcherType.API,
    matcher: "/admin/users",
    actionType: ActionType.DELETE,
    category: "Users"
  }
]

export default async function seedRbac({ container }) {
  const logger = container.resolve("logger")
  const rbacModuleService = container.resolve("rbacModuleService")
  
  logger.info("Starting RBAC seeding...")
  
  try {
    // Create categories first
    const createdCategories = new Map()
    
    for (const category of categories) {
      const existing = await rbacModuleService.listRbacPermissionCategories({
        name: category.name,
        type: category.type
      })
      
      if (existing.length === 0) {
        const created = await rbacModuleService.createRbacPermissionCategories(category)
        createdCategories.set(category.name, created)
        logger.info(`Created category: ${category.name}`)
      } else {
        createdCategories.set(category.name, existing[0])
        logger.info(`Category already exists: ${category.name}`)
      }
    }
    
    // Create permissions
    for (const permission of permissions) {
      const existing = await rbacModuleService.listRbacPermissions({
        matcher: permission.matcher,
        matcherType: permission.matcherType,
        actionType: permission.actionType
      })
      
      if (existing.length === 0) {
        const categoryId = createdCategories.get(permission.category)?.id
        
        await rbacModuleService.createRbacPermissions({
          ...permission,
          category: categoryId,
          policies: []
        })
        
        logger.info(`Created permission: ${permission.name}`)
      } else {
        logger.info(`Permission already exists: ${permission.name}`)
      }
    }
    
    logger.info("RBAC seeding completed successfully!")
    
  } catch (error) {
    logger.error("Error during RBAC seeding:", error)
    throw error
  }
} 