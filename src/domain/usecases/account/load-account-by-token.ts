export interface LoadAccountByToken {
  load: (loadAccountByTokenParams: LoadAccountByToken.Params) => Promise<LoadAccountByToken.Result>
}

export namespace LoadAccountByToken {
  export type Params = {
    accessToken: string
    role?: string
  }

  export type Result = {
    id: string
  }
}
