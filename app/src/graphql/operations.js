import { gql } from '@apollo/client'

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    role
    isActive
    companyId
    companyName
    createdAt
  }
`

export const COMPANY_FIELDS = gql`
  fragment CompanyFields on Company {
    id
    name
    ownerId
    ownerName
    createdAt
    updatedAt
  }
`

export const ME_QUERY = gql`
  query Me {
    me {
      ...UserFields
      company {
        ...CompanyFields
      }
    }
  }
  ${USER_FIELDS}
  ${COMPANY_FIELDS}
`

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        ...UserFields
        company { ...CompanyFields }
      }
    }
  }
  ${USER_FIELDS}
  ${COMPANY_FIELDS}
`

export const REGISTER_COMPANY_MUTATION = gql`
  mutation RegisterCompany($input: RegisterCompanyInput!) {
    registerCompany(input: $input) {
      token
      user {
        ...UserFields
        company { ...CompanyFields }
      }
    }
  }
  ${USER_FIELDS}
  ${COMPANY_FIELDS}
`

export const JOIN_COMPANY_MUTATION = gql`
  mutation JoinCompany($input: JoinCompanyInput!) {
    joinCompany(input: $input) {
      token
      user {
        ...UserFields
        company { ...CompanyFields }
      }
    }
  }
  ${USER_FIELDS}
  ${COMPANY_FIELDS}
`

export const COMPANY_QUERY = gql`
  query Company {
    company { ...CompanyFields }
  }
  ${COMPANY_FIELDS}
`

export const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateCompany($name: String!) {
    updateCompany(name: $name) { ...CompanyFields }
  }
  ${COMPANY_FIELDS}
`

export const PRODUCTS_QUERY = gql`
  query Products {
    products {
      id name sku category description price stock companyId createdAt updatedAt
    }
  }
`

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) { id name sku category description price stock companyId }
  }
`

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) { id name sku category description price stock companyId }
  }
`

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`

export const ORDERS_QUERY = gql`
  query Orders {
    orders {
      id orderNumber customerName customerPhone total status createdAt updatedAt
      createdBy createdByName stockReserved
      items { productId sku productName quantity unitPrice lineTotal }
    }
  }
`

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id orderNumber customerName customerPhone total status createdAt createdBy createdByName stockReserved
      items { productId sku productName quantity unitPrice lineTotal }
    }
  }
`

export const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) { id status stockReserved }
  }
`

export const DELETE_ORDER_MUTATION = gql`
  mutation DeleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`

export const USERS_QUERY = gql`
  query Users {
    users { id name email role isActive companyId companyName createdAt }
  }
`

export const INVITATIONS_QUERY = gql`
  query Invitations {
    invitations { id expiresAt createdAt revokedAt usesCount isUsable }
  }
`

export const CREATE_INVITATION_MUTATION = gql`
  mutation CreateInvitation($expiresInDays: Int!) {
    createInvitation(expiresInDays: $expiresInDays) {
      code
      invitation { id expiresAt createdAt revokedAt usesCount isUsable }
    }
  }
`

export const REVOKE_INVITATION_MUTATION = gql`
  mutation RevokeInvitation($id: ID!) {
    revokeInvitation(id: $id) { id revokedAt isUsable }
  }
`

export const UPDATE_USER_STATUS_MUTATION = gql`
  mutation UpdateUserStatus($id: ID!, $isActive: Boolean!) {
    updateUserStatus(id: $id, isActive: $isActive) { id isActive }
  }
`
