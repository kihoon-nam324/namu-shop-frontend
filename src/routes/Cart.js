import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import './../css/Cart.scss';
import { addCount, subtractCount, removeItem, clearState } from '../store.js';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { toast,ToastContainer } from 'react-toastify';

function Cart(){
    const state = useSelector((state) => state)

    const dispatch = useDispatch();
    const calculateTotalPrice = () => {
        let totalPrice = 0;

        state.cart.forEach((item) => {
            totalPrice += item.price;
        });
        return totalPrice;
    }
    let navigate = useNavigate();
    let [ 로딩, 로딩중 ] = useState(false);

    return (
        <div className="cart-background">
            <ToastContainer />
            <h3>{ state.user.name }'s Cart</h3>

            <Table responsive>
                <thead>
                    <tr>
                        <th scope="col" className="col-1">#</th>
                        <th scope="col" className="col-2">Image</th>
                        <th scope="col" className="col-4">Product Name</th>
                        <th scope="col" className="col-1">Stock</th>
                        <th scope="col" className="col-2">Order Count</th>
                        <th scope="col" className="col-1">Price</th>
                        <th scope="col" className="col-1">Change</th>
                        <th scope="col" className="col-1">Delete</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                    {   
                        state.cart.map((a,i) => {
                            return (
                                <tr key={i}>
                                    <td>{ state.cart[i].no }</td>
                                    <td><img src={ state.cart[i].productImageUrl } width="20%" height="20%" /></td> 
                                    <td>{ state.cart[i].name }</td>
                                    <td>{ state.cart[i].stock }</td>
                                    <td>{ state.cart[i].count }</td>
                                    <td>{ state.cart[i].price }</td>
                                    <td>
                                        <Button variant="warning mx-1" onClick={() => { dispatch(addCount({ no: state.cart[i].no, count: state.cart[i].count })) }}>+</Button>
                                        <Button variant="warning" onClick={() => { dispatch(subtractCount(state.cart[i].no)) }}>-</Button>
                                    </td>
                                    <td>
                                        <Button variant="primary" onClick={() => { dispatch(removeItem(state.cart[i].no)) }}>Delete</Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    <tr>
                        <td colSpan="8" style={{ textAlign: 'right' }}>
                            <h6>Total Price : ¥{ calculateTotalPrice() }</h6>
                        </td>
                    </tr>
                </tbody>
            </Table>
            <Button variant="primary mx-2" disabled={!state.cart || state.cart.length === 0} onClick={ () => { 
                로딩중(true);
                
                let reqCartBody = [];
                state.cart.forEach((item) => {
                    let updateQty = item.stock - item.count;
                    reqCartBody.push({ no: item.no, qty: updateQty });
                });
                
                try {
                    reqCartBody.forEach((item) => {
                        axios.put(`http://localhost:8080/api/Product/${item.no}`, item)
                        .then((result) => {
                            
                        })
                        .catch((e) => {
                            console.log(e.message);
                        }); 
                    });
                    로딩중(false);
                    dispatch(clearState());
                    toast.success(`Purchase Success`, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000
                    });
                    navigate('/');
                    window.location.reload();
                } catch(e) {
                    toast.error(`Purchase Failed`, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000
                    });
                }
            }}>Purchase</Button>
            <Button variant="warning" onClick={() => { navigate('/'); }}>Back to List</Button>
        </div>
    );
}

export default Cart;