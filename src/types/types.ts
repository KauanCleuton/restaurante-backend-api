
export interface IUser {
    name: string,
    email: string,
    password: string
}
export interface IToken {
    id: string,
    email: string,
    role: string
}

export interface IProducts {
  photo: string,
  name: string,
  description: string,
  price: number,
  category: string,
}