import { reactive, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatStapTime } from '@/utils/index'
import MapInfo from '@/api/map'
import startIcon from '@/assets/img/truck/icon-deliver.png'
import endIcon from '@/assets/img/truck/icon-receiving.png'
import carIcon from '@/assets/img/truck/icon-map-car.png'
import overtimeIcon from '@/assets/img/truck/icon-overtime.png'
import overspeedIcon from '@/assets/img/truck/icon-overspeed.png'

export default function indexConfig() {
  const route = useRoute()
  const router = useRouter()

  let map: any
  let positionCar: any // 车辆位置
  let positionStart: any // 起点
  let positionEnd: any // 终点
  let inforWindow: any = ''
  let labelLocation = '' // 当前位置
  let labelTime = '' // 停车时长
  let labelSection = '' // 停车区间
  let labelSpeed = '' // 车辆速度
  let content: string[] = []
  let abnormalMarkers: any = []

  let plateColor = ''

  const data = reactive<Record<string, any>>({
    routeInfo: [
      {
        departureAddress: '--',
        destinationAddress: '--',
        detailAddress: '--',
        direction: '0',
        historyRouteList: [],
        speed: '0',
        totalDistance: '0',
        truckRouteNo: ''
      }
    ],
    carInfo: [
      {
        detailAddress: '',
        direction: '',
        location: [],
        speed: 0,
        totalDistance: '',
        departureAddress: '',
        destinationAddress: ''
      }
    ],
    directionTxt: '',
    plateNo: '',
    startTime: '',
    endTime: '',
    type: '', // 1：实时位置 2：历史轨迹
    pathList: [],
    abnormalNum: 0
  })

  onMounted(() => {
    data.type = route.query.type as string
    plateColor = route.query.plateColor as string
    data.plateNo = route.query.plateNo as string
    data.startTime = route.query.startTime as string
    data.endTime = route.query.endTime as string

    if (data.type === '1') {
      document.title = '车辆实时定位'
    } else {
      document.title = '车辆轨迹查询'
    }

    document.body.addEventListener('touchmove', touchDisable, { passive: false })
    init()
  })

  function init() {
    map = new AMap.Map('mapL', {
      resizeEnable: true,
      mapStyle: 'amap://styles/279b2dbcf102970a8c7521fc2bdacb71'
    })

    if (data.type === '1') {
      getCurLocation()
    } else {
      getHistoryRoute()
    }
  }

  // 车辆实时位置
  async function getCurLocation() {
    const baseInfo = {
      plateColor: plateColor,
      plateNo: data.plateNo
    }
    const res = await MapInfo.getCurLocation(baseInfo)
    data.carInfo = res.body
    // 处理方向
    formatDirectionTxt(data.carInfo.direction)
    map.clearMap()
    if (data.carInfo.location) {
      drawRoute()
    }
  }

  // 历史轨迹
  async function getHistoryRoute() {
    const baseInfo = {
      plateColor: plateColor,
      plateNo: data.plateNo,
      startTime: Date.parse(data.startTime),
      endTime: Date.parse(data.endTime)
    }
    const res = await MapInfo.getHistoryRoute(baseInfo)
    data.pathList = []
    if (res.body.historyRouteList) {
      data.routeInfo = res.body
      res.body.historyRouteList.forEach((item: any) => {
        data.pathList.push([item.lon, item.lat])
      })

      map.clearMap()

      getOverspeedList(res.body.truckRouteNo)
      getOvertimeList(res.body.truckRouteNo)

      const len = data.pathList.length
      positionStart = new AMap.LngLat(data.pathList[0][0], data.pathList[0][1])
      positionEnd = new AMap.LngLat(data.pathList[len - 1][0], data.pathList[len - 1][1])
      drawRoute()
    }
  }

  // 超速查询
  async function getOverspeedList(truckRouteNo: string) {
    const res = await MapInfo.getOverspeedList({ truckRouteNo: truckRouteNo })
    if (res.body.overspeedList) {
      addAbnormalMarker(res.body.overspeedList, 2)
    }
  }

  // 停车超时查询
  async function getOvertimeList(truckRouteNo: string) {
    const res = await MapInfo.getOvertimeList({ truckRouteNo: truckRouteNo })
    if (res.body.stopoverList) {
      data.abnormalNum = res.body.stopoverList.length
      addAbnormalMarker(res.body.stopoverList, 1)
    }
  }

  // 绘制路线
  function drawRoute() {
    if (data.type === '1') {
      addCarIcon()
    } else {
      addIcon()
      currentPositionLine(data.pathList, '#66AE35')
    }
  }

  // 添加车辆图标
  function addCarIcon() {
    positionCar = new AMap.LngLat(data.carInfo.location[0], data.carInfo.location[1])
    const iconCar = new AMap.Icon({
      size: new AMap.Size(47, 47),
      image: carIcon,
      imageSize: new AMap.Size(47, 47)
    })
    const carMarker = new AMap.Marker({
      position: positionCar,
      icon: iconCar,
      anchor: 'center',
      angle: data.carInfo.direction
    })
    carMarker.setMap(map)
    map.setCenter(positionCar)
  }

  // 添加起点终点
  function addIcon() {
    const fillStartColor = '#66AE35'
    const fillEndColor = '#66AE35'

    let circleStart: any = ''
    let circleEnd: any = ''
    const iconStart = new AMap.Icon({
      size: new AMap.Size(31, 30),
      image: startIcon,
      imageSize: new AMap.Size(31, 30)
    })
    const iconEnd = new AMap.Icon({
      size: new AMap.Size(30, 30),
      image: endIcon,
      imageSize: new AMap.Size(30, 30)
    })

    const startMarker = new AMap.Marker({
      position: positionStart,
      icon: iconStart,
      anchor: 'bottom-center',
      zIndex: 999
    })

    startMarker.setMap(map)

    circleStart = new AMap.CircleMarker({
      center: positionStart,
      fillColor: fillStartColor,
      fillOpacity: 1,
      strokeWeight: 0,
      zIndex: 99,
      radius: 8 // 半径，单位：px
    })

    circleStart.setMap(map)

    const endMarker = new AMap.Marker({
      position: positionEnd,
      icon: iconEnd,
      anchor: 'bottom-center',
      zIndex: 999
    })
    endMarker.setMap(map)

    circleEnd = new AMap.CircleMarker({
      center: positionEnd,
      fillColor: fillEndColor,
      fillOpacity: 1,
      strokeWeight: 0,
      zIndex: 99,
      radius: 8 // 半径，单位：px
    })

    circleEnd.setMap(map)
    map.setFitView()
  }

  // 历史轨迹
  function currentPositionLine(result: any, color: string) {
    let polyline: any = ''
    polyline = new AMap.Polyline({
      path: result,
      strokeWeight: 8,
      lineJoin: 'round',
      lineCap: 'round',
      strokeColor: color,
      strokeOpacity: 1,
      showDir: true
    })
    map.add(polyline)
    map.setFitView()
  }

  // 添加超时超速marker
  function addAbnormalMarker(markerData: any, type: number) {
    abnormalMarkers = []
    let icon: any
    const len = markerData.length
    const iconOverTime = new AMap.Icon({
      size: new AMap.Size(40, 40),
      image: overtimeIcon,
      imageSize: new AMap.Size(40, 40)
    })
    const iconOverSpeed = new AMap.Icon({
      size: new AMap.Size(40, 40),
      image: overspeedIcon,
      imageSize: new AMap.Size(40, 40)
    })
    // 超时
    if (type === 1) {
      icon = iconOverTime
    } else {
      icon = iconOverSpeed
    }
    for (let i = 0; i < len; i++) {
      let extDataObj = {}
      if (type === 1) {
        extDataObj = {
          address: markerData[i].address,
          duration: markerData[i].duration,
          section: formatStapTime(markerData[i].startTime, 6) + ' - ' + formatStapTime(markerData[i].endTime, 6),
          labelType: 1
        }
      } else {
        extDataObj = {
          address: markerData[i].address,
          speed: markerData[i].speed,
          labelType: 2
        }
      }
      const abnormalMarker = new AMap.Marker({
        position: new AMap.LngLat(markerData[i].lon, markerData[i].lat),
        icon: icon,
        anchor: 'bottom-center',
        zIndex: 199,
        extData: extDataObj
      })
      abnormalMarker.setMap(map)
      abnormalMarkers.push(abnormalMarker)
      abnormalMarker.on('click', markerClick)
    }
  }

  function markerClick(e: any) {
    content = []
    // 超时
    if (e.target.getExtData().labelType === 1) {
      labelLocation = '停车位置：<span style="font-weight: 400;">' + e.target.getExtData().address + '</span>'
      labelTime = '停车时长：<span style="font-weight: 400;">' + e.target.getExtData().duration + '分钟</span>'
      labelSection = '停车区间：<span style="font-weight: 400;">' + e.target.getExtData().section + '</span>'
      content.push('<div>' + labelLocation + '</div>')
      content.push('<div>' + labelTime + '</div>')
      content.push('<div>' + labelSection + '</div>')
    } else {
      labelLocation = '超速位置：<span style="font-weight: 400;">' + e.target.getExtData().address + '</span>'
      labelSpeed = '车速：<span style="font-weight: 400;">' + e.target.getExtData().speed + 'km/h</span>'
      content.push('<div>' + labelLocation + '</div>')
      content.push('<div>' + labelSpeed + '</div>')
    }

    // 构建自定义信息窗体
    inforWindow = new AMap.InfoWindow({
      content: createInfoWindow(content.join('')),
      anchor: 'bottom-center',
      isCustom: true, // 使用自定义窗体
      offset: new AMap.Pixel(0, -50),
      autoMove: true,
      closeWhenClickMap: true
    })

    inforWindow.open(map, e.target.getPosition())
  }

  // 信息框
  function createInfoWindow(content: any) {
    const info = document.createElement('div')
    info.className = 'gwin-h5-custom-info'
    // 定义中部内容
    const middle = document.createElement('div')
    middle.className = 'gwin-h5-info-content'
    middle.innerHTML = content
    info.appendChild(middle)
    return info
  }

  function formatDirectionTxt(val: number) {
    if (val === 0) {
      data.directionTxt = '正北'
    } else if (val > 0 && val < 90) {
      data.directionTxt = '东北'
    } else if (val === 90) {
      data.directionTxt = '正东'
    } else if (val > 90 && val < 180) {
      data.directionTxt = '东南'
    } else if (val === 180) {
      data.directionTxt = '正南'
    } else if (val > 180 && val < 270) {
      data.directionTxt = '西南'
    } else if (val === 270) {
      data.directionTxt = '正西'
    } else if (val > 270 && val < 359) {
      data.directionTxt = '西北'
    }
  }

  function mapInit() {
    if (data.type === '1') {
      map.setCenter(positionCar)
      map.setZoom(9)
    } else {
      map.setFitView()
    }
  }

  function toTrajectory() {
    router.push({
      name: 'TruckRoutePlayback',
      query: {
        plateColor: plateColor,
        startTime: data.startTime,
        endTime: data.endTime,
        plateNo: data.plateNo
      }
    })
  }

  function touchDisable(e: Event) {
    e.preventDefault()
  }

  onUnmounted(() => {
    document.body.removeEventListener('touchmove', touchDisable)
    map.clearMap()
    map.destroy()
  })

  return { mapInit, data, toTrajectory }
}
