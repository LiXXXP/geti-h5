import { Request, Response } from '@gwin/networking-h5'

interface ParamsProps {
  plateColor: string
  plateNo: string
  endTime?: number
  startTime?: number
}

interface TruckRouteNoProps {
  truckRouteNo: string
}

export class MapInfo {
  async getCurLocation(params: ParamsProps): Promise<Response> {
    const request = new Request({
      url: '/api/geti/v1/TruckLocationInquiry',
      params: params,
      isMessage: true
    })
    return await request.start()
  }

  async getHistoryRoute(params: ParamsProps): Promise<Response> {
    const request = new Request({
      url: '/api/geti/v1/TruckRouteInquiry',
      params: params,
      isMessage: true
    })
    return await request.start()
  }

  async getOverspeedList(params: TruckRouteNoProps): Promise<Response> {
    const request = new Request({
      url: '/api/geti/v1/TruckOverspeedInquiry',
      params: params,
      isMessage: true
    })
    return await request.start()
  }

  async getOvertimeList(params: TruckRouteNoProps): Promise<Response> {
    const request = new Request({
      url: '/api/geti/v1/TruckStopoverInquiry',
      params: params,
      isMessage: true
    })
    return await request.start()
  }
}

export default new MapInfo()
