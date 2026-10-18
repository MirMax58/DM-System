export const typeDefs = `#graphql
    # 1. Тип користувача
    type User{
        id:ID!
        name:String!
        email:String!
    }
         # 2. Тип Товару (сутність нашого проєкту DM-System)
      type Product {
        id: ID!
        name: String!
        price: Float!
        stock: Int!
        owner: User!
      }
    
      # 3. Результат авторизації (повертає токен і дані користувача)
      type AuthPayload {
        token: String!
        user: User!
      }
    
      # 4. Запити для читання даних (Query)
      type Query {
        users: [User!]!
        me: User
        products: [Product!]!
      }
    
      # 5. Операції зміни та створення даних (Mutation)
      type Mutation {
        register(name: String!, email: String!, password: String!): AuthPayload!
        login(email: String!, password: String!): AuthPayload!
        createProduct(name: String!, price: Float!, stock: Int!): Product!
        deleteProduct(id: ID!): Boolean!
      }
  
`;