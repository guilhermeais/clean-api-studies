import { Controller } from '@/presentation/protocols'

export async function adaptResolver (controller: Controller, args: any): Promise<any> {
  const httpResponse = await controller.handle(args)
  return httpResponse.body
}
