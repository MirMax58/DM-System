export const typeDefs = `#graphql
  enum UserRole { ADMIN DROPSHIPPER }
  enum OrderStatus { NEW PROCESSING COMPLETED CANCELLED }

  type Company {
    id: ID!
    name: String!
    ownerId: ID
    ownerName: String!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: UserRole!
    isActive: Boolean!
    companyId: ID!
    companyName: String!
    company: Company!
    createdAt: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    category: String!
    description: String
    price: Float!
    stock: Int!
    companyId: ID!
    createdAt: String!
    updatedAt: String!
  }

  type OrderItem {
    productId: ID!
    sku: String!
    productName: String!
    quantity: Int!
    unitPrice: Float!
    lineTotal: Float!
  }

  type Order {
    id: ID!
    orderNumber: String!
    customerName: String!
    customerPhone: String!
    items: [OrderItem!]!
    total: Float!
    status: OrderStatus!
    createdAt: String!
    updatedAt: String!
    createdBy: ID!
    createdByName: String!
    stockReserved: Boolean!
  }

  type Invitation {
    id: ID!
    expiresAt: String!
    createdAt: String!
    revokedAt: String
    usesCount: Int!
    isUsable: Boolean!
  }

  type InvitationResult {
    code: String!
    invitation: Invitation!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterCompanyInput {
    name: String!
    email: String!
    password: String!
    companyName: String!
  }

  input JoinCompanyInput {
    name: String!
    email: String!
    password: String!
    invitationCode: String!
  }

  input ProductInput {
    name: String!
    sku: String!
    category: String!
    description: String
    price: Float!
    stock: Int!
  }

  input OrderItemInput {
    productId: ID!
    quantity: Int!
  }

  input CreateOrderInput {
    customerName: String!
    customerPhone: String!
    items: [OrderItemInput!]!
  }

  type Query {
    me: User
    company: Company!
    users: [User!]!
    products: [Product!]!
    orders: [Order!]!
    invitations: [Invitation!]!
  }

  type Mutation {
    registerCompany(input: RegisterCompanyInput!): AuthPayload!
    joinCompany(input: JoinCompanyInput!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateCompany(name: String!): Company!
    createInvitation(expiresInDays: Int = 7): InvitationResult!
    revokeInvitation(id: ID!): Invitation!
    updateUserStatus(id: ID!, isActive: Boolean!): User!
    createProduct(input: ProductInput!): Product!
    updateProduct(id: ID!, input: ProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
    createOrder(input: CreateOrderInput!): Order!
    updateOrderStatus(id: ID!, status: OrderStatus!): Order!
    deleteOrder(id: ID!): Boolean!
  }
`;
