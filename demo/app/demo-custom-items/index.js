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
const usHeaderLabelFormats = Object.assign({}, defaultSubHeaderLabelFormats, {
  yearShort: 'YY',
  yearLong: 'YYYY',
  monthShort: 'MM/YY',
  monthMedium: 'MM/YYYY',
  monthMediumLong: 'MMM YYYY',
  monthLong: 'MMMM YYYY',
  dayShort: 'L',
  dayLong: 'dddd, LL',
  time: 'LLL',
  hourShort: 'hh A',
  hourMedium: 'hh A',
  hourMediumLong: 'h A',
  hourLong: 'dddd, LL, h A'
});

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
    const id = 1;

    this.state = {
      groups,
      items,
      defaultTimeStart,
      defaultTimeEnd,
      id
    }
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

  groupRenderer = ({ group }) => {
    return (
      <table>
        <tbody>
        <tr>
          <td>{group.title}</td>
          <td><button onClick={()=>{this.setState({id: 2})}}>test</button></td>
        </tr>
        </tbody>
      </table>
    )
  }

  render() {
    const { groups, items, defaultTimeStart, defaultTimeEnd, id } = this.state
    console.log(id)
    return (
      <Timeline
        key={id}
        groups={groups}
        items={items}
        groupRenderer = {this.groupRenderer}
        itemRenderer = {this.itemRenderer}
        keys={keys}
        sidebarWidth={290}
        sidebarContent={()=>{return <div>ts</div>}}
        itemsSorted
        itemTouchSendsClick={true}
        showCursorLine
        canMove={false}
        canResize={false}
        defaultTimeStart={defaultTimeStart}
        defaultTimeEnd={defaultTimeEnd}
        headerLabelFormats={usHeaderLabelFormats}
        subHeaderLabelFormats={usSubHeaderLabelFormats}
        minZoom={24*60*60*1000}
        maxZoom={24*60*60*1000}
        onTimeChange={this.handleTimeChange}
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
