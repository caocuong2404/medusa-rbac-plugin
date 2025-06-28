import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text } from "@medusajs/ui"

// RBAC Dashboard Widget
const RbacDashboard = () => {
  return (
    <Container className="p-6">
      <Heading level="h1">RBAC Dashboard</Heading>
      <Text className="mt-4">
        Role-Based Access Control system for managing user permissions.
      </Text>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <Heading level="h3">Roles</Heading>
          <Text className="mt-2">Manage user roles and their permissions</Text>
        </div>
        
        <div className="border rounded-lg p-4">
          <Heading level="h3">Permissions</Heading>
          <Text className="mt-2">Configure access permissions for different resources</Text>
        </div>
        
        <div className="border rounded-lg p-4">
          <Heading level="h3">Users</Heading>
          <Text className="mt-2">Assign roles to users and manage access</Text>
        </div>
      </div>
    </Container>
  )
}

// Widget configuration
export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default RbacDashboard 