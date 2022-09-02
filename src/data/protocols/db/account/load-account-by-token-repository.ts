
export interface LoadAccountByTokenRepository {
  loadByToken: (params: LoadAccountByTokenRepository.Params) => Promise<LoadAccountByTokenRepository.Result|null>
}

export namespace LoadAccountByTokenRepository {
  export type Params = {
    accessToken: string
    role?: string
  }

  export type Result = {
    id: string
  }

}
