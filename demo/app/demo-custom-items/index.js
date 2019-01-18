import React, { Component } from 'react'
import moment from 'moment'

import Timeline, { defaultSubHeaderLabelFormats, TodayMarker } from 'react-calendar-timeline'
// import containerResizeDetector from 'react-calendar-timeline/lib/resize-detector/container'

import generateFakeData from '../generate-fake-data'

var minTime = moment().startOf("day").toDate().valueOf()
var maxTime = moment().endOf("day").toDate().valueOf()

var keys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'title',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start',
  itemTimeEndKey: 'end'
}

const usSubHeaderLabelFormats = Object.assign(
  {},
  defaultSubHeaderLabelFormats,
  {  yearShort: 'YY',
    yearLong: 'YYYY',
    monthShort: 'MM',
    monthMedium: 'MMM',
    monthLong: 'MMMM',
    dayShort: 'D',
    dayMedium: 'dd D',
    dayMediumLong: 'ddd, Do',
    dayLong: 'dddd, Do',
    minuteShort: 'mm',
    hourShort: 'hh A',
    hourLong: 'hh A',
    minuteLong: 'h:mm A'
  }
)

export default class App extends Component {
  constructor(props) {
    super(props)

    const { groups, items } = generateFakeData()
    const defaultTimeStart = moment()
      .startOf('day')
      .toDate()
    const defaultTimeEnd = moment()
      .startOf('day')
      .add(1, 'day')
      .toDate()

    const groupExtendInfoList = [{data: 'Test'}]

    const key = 1;

    this.state = {
      groups,
      groupExtendInfoList,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      key
    }
  }

  handleCanvasClick = (groupId, time, event) => {
    console.log('Canvas clicked', groupId, moment(time).format())
  }

  handleCanvasContextMenu = (group, time, e) => {
    console.log('Canvas context menu', group, moment(time).format())
  }

  handleItemClick = (itemId, _, time) => {
    console.log('Clicked: ' + itemId, moment(time).format())
  }

  handleItemSelect = (itemId, _, time) => {
    console.log('Selected: ' + itemId, moment(time).format())
  }

  handleItemDoubleClick = (itemId, _, time) => {
    console.log('Double Click: ' + itemId, moment(time).format())
  }

  handleItemContextMenu = (itemId, _, time) => {
    console.log('Context Menu: ' + itemId, moment(time).format())
  }

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state

    const group = groups[newGroupOrder]

    this.setState({
      items: items.map(
        item =>
          item.id === itemId
            ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id
            })
            : item
      )
    })

    console.log('Moved', itemId, dragTime, newGroupOrder)
  }

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state

    this.setState({
      items: items.map(
        item =>
          item.id === itemId
            ? Object.assign({}, item, {
              start: edge === 'left' ? time : item.start,
              end: edge === 'left' ? item.end : time
            })
            : item
      )
    })

    console.log('Resized', itemId, time, edge)
  }

  // this limits the timeline to -6 months ... +6 months
  handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime)
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart))
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime)
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd)
    }
  }

  moveResizeValidator = (action, item, time, resizeEdge) => {
    if (time < new Date().getTime()) {
      var newTime =
        Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000)
      return newTime
    }

    return time
  }

  itemRenderer = ({
    item,
    timelineContext,
    itemContext,
    getItemProps,
    getResizeProps,
  }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps()
    const backgroundColor = itemContext.selected ? itemContext.dragging ? 'red' : item.selectedBgColor : item.bgColor;
    const borderColor = itemContext.resizing ? 'red' : item.color;
    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color: item.color,
            borderColor,
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 4,
            borderLeftWidth: itemContext.selected ? 3 : 1,
            borderRightWidth: itemContext.selected ? 3 : 1,
          }
        }) }
      >
        {itemContext.useResizeHandle ? (
          <div {...leftResizeProps} />
        ) : null}

        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: 'hidden',
            paddingLeft:3,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {itemContext.title}
        </div>


        {itemContext.useResizeHandle ? (
          <div {...rightResizeProps} />
        ) : null}
      </div>
    )
  }

  groupRenderer = ({ group, groupExtendInfoList }) => {
    console.log('group Renderer')
    return (
      <div className='custom-group'>
        {JSON.stringify(groupExtendInfoList)}
        <button onClick={()=>{
          this.setState({key: 2})

          console.log('setState')
        }}>Test</button>
      </div>
    )
  }

  componentDidMount(){

  }

  render() {
    const { groups, groupExtendInfoList, items, defaultTimeStart, defaultTimeEnd } = this.state

    console.log(groupExtendInfoList)
    return (
      <Timeline
        key={this.state.key}
        groups={groups}
        groupExtendInfoList={groupExtendInfoList}
        items={items}
        keys={keys}
        sidebarWidth={150}
        sidebarContent={<div>Above The Left</div>}
        // rightSidebarWidth={150}
        // rightSidebarContent={<div>Above The Right</div>}

        itemTouchSendsClick={false}
        showCursorLine
        // resizeDetector={containerResizeDetector}

        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        itemRenderer={this.itemRenderer}
        groupRenderer={this.groupRenderer}

        onItemSelect={this.handleItemSelect}
        onTimeChange={this.handleTimeChange}
        subHeaderLabelFormats={usSubHeaderLabelFormats}

        minZoom={24*60*60*1000}
        maxZoom={24*60*60*1000}
        lineHeight={50}
        itemHeightRatio={0.85}
        firstZoomAllow={true}
        firstZoomRatio={0.6}
      >
        <TodayMarker interval={10000}/>
      </Timeline>
    )
  }
}
