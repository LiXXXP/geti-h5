import { Request } from '@gwin/networking-h5'

class HomeApi {
  async checkCar(params: any) {
    const request = new Request({
      url: '/api/geti/v1/TruckWhitelistCheck',
      method: 'post',
      isLoading: false,
      isError: true,
      params: params
    })
    return await request.start()
  }
}

export default new HomeApi()
