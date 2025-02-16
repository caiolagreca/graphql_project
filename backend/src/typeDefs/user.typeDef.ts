export const userTypeDef = `#graphql
type User {
  id: ID!
  name: String!
  username: String!
  password: String!
  profilePicture: String
  gender: String!
}

type Query {
  users: [User!]
  user(userId: ID!): User
  authUser: User
}

type Mutation {
  signUp(input: SignUpInput!): User
  login(input: LoginInput!): User
  logout: LogoutResponse
}

input SignUpInput {
  username: String!
  name: String!
  password: String!
  gender: String! 
}

input LoginInput{
  username: String!
  password: String!
}

type LogoutResponse {
  message: String!
}
`;
