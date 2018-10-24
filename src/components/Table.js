import React, { Component } from 'react';


class Table extends Component {


    render() {

    	return (
    		<table>
    			<thead>
    				<tr>{this.props.fields.map(field => <th key={field}>{field}</th>)}</tr>
    			</thead>
    			<tbody>
    				{this.props.data.map(item => 
                        <tr key={item.id}>{this.props.fields.map(field => <td key={field}>{item[field]}</td>)}</tr>

                        /*<Item key={item.id} item={item} fields={this.props.fields}/>*/
                    )}
    			</tbody>
    		</table>

    	)
    }
}


export default Table