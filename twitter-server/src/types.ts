export interface JwtUser {
  id: string;
  email: string;
}

export interface GraphQlContext {
  user?: JwtUser;
}
