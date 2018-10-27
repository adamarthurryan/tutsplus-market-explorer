import React, { Component } from 'react'
import 'react-virtualized/styles.css'
import {AutoSizer, Table, Column, WindowScroller} from 'react-virtualized'

import fieldParams from './fieldParams'


class VirtualizedTable extends Component {


    render() {
    	return (
            <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (

            <AutoSizer disableHeight>
            {({width }) => (
 

//            <ColumnSizer
//            columnMaxWidth={500}
//            columnMinWidth={100}
//            columnCount={this.props.fields.length}
//            width={width}
//            >
//            {({ adjustedWidth, getColumnWidth, registerChild }) => (

                <Table
            
//                    ref={registerChild}
//                    columnWidth={getColumnWidth}
//                    width={adjustedWidth}

                    autoHeight
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
 
                    width={width}
                    height={height}
                    rowCount={this.props.data.length}
                    rowGetter={({index})=>this.props.data[index]}

                    rowHeight={20}
                    headerHeight={30}
                >
                    {this.props.fields.map(field => {
                        return <Column
                            key={field}
                            flexGrow={1}
                            maxWidth={500}
                            minWidth={25}
                            width={
                                (fieldParams[field] && fieldParams[field].width) ? 
                                fieldParams[field].width : 100
                            }
                            label={
                                (fieldParams[field] && fieldParams[field].label) ? 
                                fieldParams[field].label : field
                            }
                            cellRenderer={ ({cellData, rowData}) =>  
                                (fieldParams[field] && fieldParams[field].render) ? 
                                fieldParams[field].render(cellData, rowData) : cellData
                            }
                            dataKey={field}


                        />
                    }
                    )}
                </Table>
//            )}</ColumnSizer>
            )}</AutoSizer>
            )}</WindowScroller>
    	)
    }
}

export default VirtualizedTable