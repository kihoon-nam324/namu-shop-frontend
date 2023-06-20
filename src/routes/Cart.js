import React from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import './../css/Cart.scss';
import { addCount, subtractCount, removeItem } from '../store.js';
import { Button } from 'react-bootstrap';

function Cart(){

    let state = useSelector((state) => state)
    let dispatch = useDispatch();

    return (
        <div>
            <h6>{ state.user.name }'s Cart</h6>

            <Table responsive>
                <thead>
                    <tr>
                        <th scope="col" className="col-1">#</th>
                        <th scope="col" className="col-2">Image</th>
                        <th scope="col" className="col-4">Product Name</th>
                        <th scope="col" className="col-1">Quantity</th>
                        <th scope="col" className="col-1">Price</th>
                        <th scope="col" className="col-1">Change</th>
                        <th scope="col" className="col-1">Delete</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {
                        // props.state.map((a,i) => {
                        state.cart.map((a,i) => {
                            return (
                                <tr key={i}>
                                    <td>{ state.cart[i].no }</td>
                                    <td><img src={ state.cart[i].productImageUrl } width="15%" height="15%" /></td> 
                                    <td>{ state.cart[i].name }</td>
                                    <td>{ state.cart[i].count }</td>
                                    <td>{ state.cart[i].price }</td>
                                    <td>
                                        <Button variant="Secondary" onClick={() => { dispatch(addCount(state.cart[i].no)) }}>+</Button>
                                        <Button variant="Secondary" onClick={() => { dispatch(subtractCount(state.cart[i].no)) }}>-</Button>
                                    </td>
                                    <td>
                                        <Button variant="primary" onClick={() => { dispatch(removeItem(state.cart[i].no)) }}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
        </div>
    );
}

export default Cart;