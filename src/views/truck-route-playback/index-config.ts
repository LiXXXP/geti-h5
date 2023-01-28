import { reactive, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { getTime } from '@/utils/index'
import MapInfo from '@/api/map'
import startIcon from '@/assets/img/truck/icon-deliver.png'
import endIcon from '@/assets/img/truck/icon-receiving.png'
import carIcon from '@/assets/img/truck/icon-map-car.png'
import overtimeIcon from '@/assets/img/truck/icon-overtime.png'
import overspeedIcon from '@/assets/img/truck/icon-overspeed.png'
import { Toast } from 'vant'

export default function indexConfig1() {
  const route = useRoute()

  let map: any
  let positionStart: any
  let positionEnd: any
  const markers: any = []
  let abnormalMarkers: any = []
  let timer: NodeJS.Timer | null = null
  let passTimeSecond = 0
  let totalTimeSecond = 0

  let plateColor = ''

  const data = reactive<Record<string, any>>({
    routeInfo: [
      {
        abnormalNum: '',
        departureAddress: '',
        destinationAddress: '',
        detailAddress: '',
        direction: '',
        historyRouteList: [],
        speed: '',
        totalDistance: '',
        truckRouteNo: ''
      }
    ],
    plateNo: '',
    startTime: '',
    endTime: '',
    pathList: [], // 轨迹List
    speedBlock: false
  })

  // 回放属性
  const playerData = reactive<Record<string, any>>({
    sliderVal: 0, // 进度条滑动速度
    times: 20, // 几倍速度播放
    passedTime: '00:00:00', // 已经走了的时间
    totalTime: '00:00:00', // 已经走了的时间
    isPlay: false,
    navgtr: null, // 巡航器
    pathSimplifierIns: null,
    isOnSlider: false, // 是否为手动鼠标拉动进度条
    trackList: [], // 轨迹点信息
    playIcon: 'resume',
    pathSimplifier: null // 巡航起样式
  })

  // 倍速
  const doubleSpeed = [1, 5, 10, 20, 50, 100]

  let startPoint: any
  let endPoint: any

  watch(
    () => playerData.sliderVal,
    (newVal) => {
      if (!playerData.isOnSlider) {
        return false
      }
      sliderChange(newVal)
    }
  )

  onMounted(() => {
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
    map = new AMap.Map('mapA', {
      resizeEnable: true,
      mapStyle: 'amap://styles/279b2dbcf102970a8c7521fc2bdacb71'
    })

    getHistoryRoute()
  }

  async function getHistoryRoute() {
    const baseInfo = {
      plateColor: plateColor,
      plateNo: data.plateNo,
      startTime: Date.parse(data.startTime),
      endTime: Date.parse(data.endTime)
    }
    const res = await MapInfo.getHistoryRoute(baseInfo)

    if (res.body.historyRouteList) {
      getOverspeedList(res.body.truckRouteNo)
      getOvertimeList(res.body.truckRouteNo)
      const historyRouteList = res.body.historyRouteList
      data.pathList = []
      const len = historyRouteList.length
      startPoint = historyRouteList[0]
      endPoint = historyRouteList[len - 1]
      data.routeInfo = res.body

      for (let i = 0; i < len; i++) {
        data.pathList.push([historyRouteList[i].lon, historyRouteList[i].lat])
      }

      for (let i = 0; i < len; i++) {
        // 下一段路程经历了多少s,intervalTime,nextDistance:下一段路程：m,nextSpeed:下一段路速度：km/h
        const next = historyRouteList[i + 1]
        if (next) {
          historyRouteList[i].intervalTime = (next.time - historyRouteList[i].time) / 1000
          historyRouteList[i].nextDistance = distanceFun(
            [historyRouteList[i].lon, historyRouteList[i].lat],
            [next.lon, next.lat]
          )
          if (historyRouteList[i].intervalTime !== 0) {
            historyRouteList[i].nextSpeed =
              historyRouteList[i].nextDistance / 1000 / (historyRouteList[i].intervalTime / 60 / 60)
          } else {
            historyRouteList[i].nextSpeed = 0
          }
        }
      }

      playerData.trackList = historyRouteList
      playerData.totalTime = getTime((endPoint.time - startPoint.time) / 1000)
      totalTimeSecond = (endPoint.time - startPoint.time) / 1000
      map.clearMap()
      positionStart = new AMap.LngLat(startPoint.lon, startPoint.lat)
      positionEnd = new AMap.LngLat(endPoint.lon, endPoint.lat)
      addIcon()
      setPath()
      drag(false)
    }
  }

  async function getOverspeedList(truckRouteNo: string) {
    const res = await MapInfo.getOverspeedList({ truckRouteNo: truckRouteNo })
    if (res.body.overspeedList) {
      addAbnormalMarker(res.body.overspeedList, 2)
    }
  }

  async function getOvertimeList(truckRouteNo: string) {
    const res = await MapInfo.getOvertimeList({ truckRouteNo: truckRouteNo })
    if (res.body.stopoverList) {
      addAbnormalMarker(res.body.stopoverList, 1)
    }
  }

  // 绘制巡航路线及创建巡航器
  function setPath() {
    AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier: any) {
      playerData.pathSimplifier = PathSimplifier
      if (!PathSimplifier.supportCanvas) {
        Toast('当前浏览器环境不支持Canvas！')
        return
      }

      function onload() {
        playerData.pathSimplifierIns.renderLater()
      }
      function onerror() {
        console.log('图片加载失败！')
      }

      playerData.pathSimplifierIns = new PathSimplifier({
        zIndex: 100,
        map: map, // 所属的地图实例
        getPath: function (pathData: any) {
          return pathData.path
        },
        autoSetFitView: true,
        // 巡航器样式
        renderOptions: {
          eventSupport: false,
          eventSupportInvisible: false,
          startPointStyle: {
            radius: 8,
            lineWidth: 0,
            fillStyle: '#66AE35'
          },
          endPointStyle: {
            radius: 8,
            lineWidth: 0,
            fillStyle: '#66AE35'
          },
          pathNavigatorStyle: {
            // 巡航起样式
            width: 40,
            height: 40,
            autoRotate: true,
            lineJoin: 'round',
            content: PathSimplifier.Render.Canvas.getImageContent(carIcon, onload, onerror),
            fillStyle: null,
            strokeStyle: null,
            lineWidth: 0,
            pathLinePassedStyle: {
              lineWidth: 6,
              borderWidth: 0,
              borderStyle: '#66AE35',
              strokeStyle: '#66AE35'
            }
          },
          pathLineStyle: {
            // 巡航路线样式
            lineWidth: 6,
            strokeStyle: '#BFDCC3',
            dirArrowStyle: true
          },
          pathTolerance: 0,
          keyPointTolerance: -1,
          renderAllPointsIfNumberBelow: 0 // 绘制路线节点，如不需要可设置为-1
        }
      })

      // 历史轨迹巡航器设置数据
      playerData.pathSimplifierIns.setData([
        {
          name: '轨迹',
          path: data.pathList
        }
      ])

      let startSpeed = speedFun(data.pathList[0], data.pathList[1], startPoint.intervalTime)
      startSpeed === 0 && (startSpeed = 0.0001)

      // 对第一条线路（即索引 0）创建一个巡航器
      playerData.navgtr = playerData.pathSimplifierIns.createPathNavigator(0, {
        loop: false, // 循环播放
        speed: startSpeed * playerData.times // 巡航速度，单位千米/小时
      })

      setTimeout(function () {
        playerData.pathSimplifierIns.setFitView(-1)
        map.setFitView(null, true, [50, 50, 50, 50])
      }, 500)

      carMoving()
    })
  }

  function carMoving() {
    const len = playerData.trackList.length
    playerData.navgtr.on('move', function () {
      playerData.playIcon = 'resume'
      const idx = parseInt(playerData.navgtr.getCursor().idx) // 走到了第几个点

      // // 计算下一个距离速度
      const point = playerData.trackList[idx]
      if (idx <= len - 1) {
        if (point.nextSpeed === 0) {
          point.nextSpeed = 0.0001
          playerData.navgtr.setSpeed(point.nextSpeed)
        } else {
          playerData.navgtr.setSpeed(point.nextSpeed * playerData.times)
        }
      }
      if (idx === len - 1) {
        playerData.sliderVal = 100
      }

      // 如果到头了，回到初始状态
      if (playerData.navgtr.isCursorAtPathEnd()) {
        playerData.playIcon = 'start'
        playerData.isPlay = false
        playerData.passedTime = getTime(totalTimeSecond)
        passTimeSecond = 0
        if (timer) {
          clearInterval(timer)
        }
      }
    })

    playerData.navgtr.on('start resume', function () {
      playerData.navgtr._startTime = Date.now()
      playerData.navgtr._startDist = playerData.navgtr.getMovedDistance()
    })

    playerData.navgtr.on('stop pause', function () {
      playerData.isPlay = false
      playerData.navgtr._movedTime = Date.now() - playerData.navgtr._startTime
      playerData.navgtr._movedDistance = playerData.navgtr.getMovedDistance() - playerData.navgtr._startDist
    })
  }

  // 开始、暂停、继续等操作
  function navgControl(action: string) {
    if (action === 'start') {
      playerData.isPlay = true
      playerData.sliderVal = 0
      passTimeSecond = 0
      playerData.passedTime = '00:00:00'
      setTimeout(() => {
        playerData.navgtr[action]()
        sliderAvg()
      }, 300)
    } else {
      playerData.navgtr[action]()
      if (action === 'pause') {
        if (timer) {
          clearInterval(timer)
        }
      } else {
        playerData.isPlay = true
        sliderAvg()
      }
    }
  }

  function sliderAvg() {
    timer = setInterval(function () {
      const idx = parseInt(playerData.navgtr.getCursor().idx) // 走到了第几个点
      const tail = playerData.navgtr.getCursor().tail // 至下一个节点的比例位置
      const totalIdx = idx + tail
      if (passTimeSecond === totalTimeSecond) {
        if (timer) {
          clearInterval(timer)
        }
        // playerData.playIcon = 'start'
        // playerData.isPlay = false
        passTimeSecond = 0
        return
      }
      playerData.sliderVal = (totalIdx / playerData.trackList.length) * 100
      passTimeSecond = passTimeSecond + 1
      playerData.passedTime = getTime(passTimeSecond)
    }, 1000 / playerData.times)
  }

  // 计算两个坐标点之间的距离
  function distanceFun(point1: number[], point2: number[]) {
    const p1 = new AMap.LngLat(point1[0], point1[1])
    const p2 = new AMap.LngLat(point2[0], point2[1])
    const distance = Math.round(p1.distance(p2))
    return distance
  }
  //
  function speedFun(point1: number[], point2: number[], time: number) {
    // point1,point2:经纬度数组，time:时间，s
    const distance = distanceFun(point1, point2)
    if (distance === 0) {
      return 0
    } else {
      const speed = distance / 1000 / (time / 60 / 60)
      // speed:km/h
      return speed
    }
  }

  // 拖动条
  function sliderChange(val: any) {
    const newVal = typeof val === 'number' ? val : playerData.sliderVal
    const num = parseInt(((newVal / 100) * (data.pathList.length - 1)).toString())
    const decimal = String((newVal / 100) * data.pathList.length).split('.')[1] || 0
    playerData.navgtr.start() // 重要！！！未播放就拖动时要调用start和pause，否则巡航器经过样式不起作用
    playerData.navgtr.moveToPoint(num, Number('0.' + decimal))
    playerData.pathSimplifierIns.renderLater()
    passTimeSecond = (playerData.trackList[num].time - startPoint.time) / 1000
    playerData.passedTime = getTime(passTimeSecond)
    if (!playerData.isPlay) {
      // 重要！！！未播放就拖动时要调用start和pause，否则巡航器经过样式不起作用
      playerData.navgtr.pause()
    }
  }

  function drag(isRemove: boolean) {
    const el = document.getElementsByClassName('van-slider__button-wrapper')[0]

    if (isRemove) {
      el && el.removeEventListener('touchstart', openSlider, false)
      el.removeEventListener('touchend', closeSlider, false)
      return false
    }
    el.addEventListener('touchstart', openSlider, false)
    // 此处用document是因为，滑动较为随意时，mouseup可能不是作用在el上
    el.addEventListener('touchend', closeSlider, false)
  }

  function openSlider() {
    playerData.isOnSlider = true
  }

  function closeSlider() {
    playerData.isOnSlider = false
  }

  // 添加起点终点
  function addIcon() {
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
    markers.push(startMarker)

    const endMarker = new AMap.Marker({
      position: positionEnd,
      icon: iconEnd,
      anchor: 'bottom-center',
      zIndex: 999
    })
    endMarker.setMap(map)
    markers.push(endMarker)

    setTimeout(() => {
      map.setFitView(markers, true, [100, 100, 100, 100])
    }, 500)
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
      const abnormalMarker = new AMap.Marker({
        position: new AMap.LngLat(markerData[i].lon, markerData[i].lat),
        icon: icon,
        anchor: 'bottom-center',
        zIndex: 199
      })
      abnormalMarker.setMap(map)
      abnormalMarkers.push(abnormalMarker)
    }
  }

  // 确认修改倍速
  function onConfirm(times: string) {
    data.speedBlock = false
    playerData.times = times
    if (timer) {
      clearInterval(timer)
    }
    if (playerData.isPlay) {
      sliderAvg()
    }
  }

  // 取消选择倍速
  function onCancel() {
    data.speedBlock = false
  }

  function mapInit() {
    map.setFitView(markers, true, [200, 200, 200, 200])
    playerData.pathSimplifierIns.setFitView(-1)
  }

  function touchDisable(e: Event) {
    e.preventDefault()
  }

  onBeforeUnmount(() => {
    document.body.removeEventListener('touchmove', touchDisable)
    map.clearMap()
    map.destroy()
    playerData.navgtr.destroy()
    playerData.navgtr = null
    if (timer) {
      clearInterval(timer)
    }
  })

  return { mapInit, data, playerData, doubleSpeed, onConfirm, onCancel, navgControl, sliderChange }
}
