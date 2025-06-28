# Medusa RBAC Plugin

A comprehensive Role-Based Access Control (RBAC) plugin for MedusaJS v2 that provides fine-grained permission management for your Medusa application.

## Features

- **Role Management**: Create, update, and delete roles
- **Permission System**: Predefined and custom permissions for API endpoints
- **Policy Engine**: Allow/deny policies for granular access control
- **Permission Categories**: Organize permissions into logical groups
- **Admin UI**: React components for managing RBAC through the admin dashboard
- **Database Migrations**: Automatic database schema setup
- **Seeding Script**: Populate with predefined permissions
- **Workflows**: Business logic for RBAC operations
- **Authorization API**: Check user permissions programmatically

## Installation

1. Add the plugin to your `medusa-config.js`:

```js
const plugins = [
  // ... other plugins
  {
    resolve: "./src", // Local plugin path
    options: {
      // Plugin options (if any)
    }
  }
]
```

2. Run database migrations:

```bash
npx medusa db:migrate
```

3. Seed the database with predefined permissions:

```bash
npx medusa exec src/scripts/seed-rbac.ts
```

## Core Concepts

### Permission
A permission defines an action that can be performed. Each permission has:
- **Name**: Human-readable name
- **Type**: `predefined` or `custom`
- **Matcher Type**: Currently supports `api` (API endpoints)
- **Matcher**: The API path (e.g., `/admin/products`)
- **Action Type**: `read`, `write`, or `delete`
- **Category**: Optional grouping

### Role
A role is a collection of policies that can be assigned to users. Roles define what a user can or cannot do.

### Policy
A policy connects a permission to a role with a decision (`allow` or `deny`). Policies determine the actual access control.

### Permission Category
Categories help organize permissions into logical groups like "Products", "Orders", "Customers", etc.

## API Endpoints

### Roles
- `GET /admin/rbac/roles` - List all roles
- `POST /admin/rbac/roles` - Create a new role
- `DELETE /admin/rbac/roles` - Delete a role

### Permissions
- `GET /admin/rbac/permissions` - List all permissions
- `POST /admin/rbac/permissions` - Create a custom permission
- `GET /admin/rbac/permissions/:id` - Get permission details
- `DELETE /admin/rbac/permissions/:id` - Delete a custom permission

### Categories
- `GET /admin/rbac/categories` - List permission categories
- `POST /admin/rbac/categories` - Create a permission category

### Authorization Check
- `POST /admin/rbac/check` - Check if a user has permission for a specific action

## Usage Examples

### Creating a Role

```typescript
import { CreateRoleRequest, PolicyType } from "./src/modules/rbac/types"

const roleData: CreateRoleRequest = {
  name: "Product Manager",
  policies: [
    {
      permission: { id: "permission-id-for-read-products" },
      type: PolicyType.ALLOW
    },
    {
      permission: { id: "permission-id-for-write-products" },
      type: PolicyType.ALLOW
    },
    {
      permission: { id: "permission-id-for-delete-products" },
      type: PolicyType.DENY
    }
  ]
}

// POST to /admin/rbac/roles with roleData
```

### Creating a Custom Permission

```typescript
import { 
  CreatePermissionRequest, 
  PermissionType, 
  PermissionMatcherType, 
  ActionType 
} from "./src/modules/rbac/types"

const permissionData: CreatePermissionRequest = {
  name: "Read Custom Reports",
  type: PermissionType.CUSTOM,
  matcherType: PermissionMatcherType.API,
  matcher: "/admin/custom-reports",
  actionType: ActionType.READ,
  category: { id: "analytics-category-id" }
}

// POST to /admin/rbac/permissions with permissionData
```

## Database Schema

The plugin creates the following tables:

- `rbac_permission_category` - Permission categories
- `rbac_permission` - Individual permissions
- `rbac_role` - User roles
- `rbac_policy` - Policies linking roles and permissions

## Predefined Permissions

The seeding script creates predefined permissions for common Medusa resources:

- **Products**: Read, Write, Delete permissions for `/admin/products`
- **Orders**: Read, Write, Delete permissions for `/admin/orders`
- **Customers**: Read, Write, Delete permissions for `/admin/customers`
- **Users**: Read, Write, Delete permissions for `/admin/users`

## Development

To extend this plugin:

1. Add custom permissions using the API
2. Create custom roles with specific policy combinations
3. Implement middleware to check permissions in your custom routes
4. Extend the admin UI with additional React components

## Compatibility

This plugin is compatible with MedusaJS v2 (versions >= 2.4.0).

## License

MIT License - Feel free to use this plugin in your commercial and personal projects. 