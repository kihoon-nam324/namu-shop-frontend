//import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
//import styled from 'styled-components';
import './../css/Detail.scss';
import { CSSTransition } from 'react-transition-group';
import { useDispatch } from 'react-redux';
import { addItem } from "./../store.js";


// let 박스 = styled.div`
//     padding : 5ex;
// `;
// let 제목 = styled.h4`
//     font-size: 25px;
//     color : ${ props => props.색상 };
// `;

function Detail(props) {
    let [alert, alert변경] = useState(true);
    let [alert메세지, alert메세지변경] = useState('This stock is currently running low.');
    let [누른탭, 누른탭변경] = useState(0);
    let [스위치, 스위치변경] = useState(false);
    let [주문수량, 주문수량변경] = useState(0);

    let { no } = useParams();
    let navigate = useNavigate();
    let 찾은상품 = props.products.find(x => x.no === parseInt(no));
    let dispatch = useDispatch();

    useEffect(() => {
        let 꺼낸거 = localStorage.getItem('watched')
        꺼낸거 = JSON.parse(꺼낸거)
        꺼낸거.push(찾은상품.no);
        꺼낸거 = new Set(꺼낸거);
        꺼낸거 = Array.from(꺼낸거);
        localStorage.setItem('watched', JSON.stringify(꺼낸거))
    }, [])

    useEffect(() => {
        // 2초 후에 alert 창을 안보이게 하기
        let timer = setTimeout(() => {alert변경(false)},5000);

    },[alert]);


    return (
        <div className="container">
            {/* <박스>
                <제목 className="red"</제목>
            </박스> */}
            <p>{ 찾은상품.name }</p>
            {
                (alert === true) ? 
                (<div className="my-alert2">
                    <p>{alert메세지}</p>
                </div>) : null
            }
            
            <div className="row">
                <div className="col-md-6 mt-5 pt-1">
                    <img src={ 찾은상품.productImageUrl } width="100%" height="100%" />
                </div>
                <div className="col-md-6">
                    <h4 className="pt-5">{찾은상품.name}</h4>
                    <p>Stock : {찾은상품.qty}</p>
                    <p>Price : ¥{찾은상품.listPrice}</p>
                    <p>Order Quantity : <input onChange={(e) => {주문수량변경(e.target.value)}} value={주문수량}/></p>
                    <button className="btn btn-danger" onClick={() => {                             
                            if(parseInt(주문수량) === 0){
                                alert메세지변경('Please enter the order quantity.');
                                alert변경(true);
                                return;
                            }
                            if(주문수량 > 찾은상품.qty){
                                alert메세지변경('The order quantity exceeds the stock quantity.');
                                alert변경(true);
                                return;
                            }

                            dispatch(addItem( {no : 찾은상품.no, productImageUrl: 찾은상품.productImageUrl, name: 찾은상품.name, count: parseInt(주문수량), price: (parseInt(찾은상품.listPrice)* parseInt(주문수량)), unitPrice: parseInt(찾은상품.listPrice), stock: parseInt(찾은상품.qty) }));
                            navigate('/cart');
                        }}>Add Cart</button>
                    &nbsp;
                    <button className="btn btn-danger" onClick={() => {
                        navigate('/');
                    }}>Back</button>
                </div>
            </div>
            <Nav className="mt-5" variant="tabs" defaultActiveKey="/link-0">
                <Nav.Item>
                    <Nav.Link eventKey="link-0" onClick={() => {스위치변경(false); 누른탭변경(0)}}>Product Description</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="link-1" onClick={() => {스위치변경(false); 누른탭변경(1)}}>Shipping Information</Nav.Link>
                </Nav.Item>
            </Nav>
            <CSSTransition in={스위치} classNames="wow" timeout={500}>
                <TabContent 누른탭={누른탭} 스위치변경={스위치변경} 찾은상품={찾은상품} />
            </CSSTransition>
        </div>
    );
}

function TabContent(props){
    useEffect(() => {
        props.스위치변경(true);
    })

    if(props.누른탭 === 0){
        return <div>{props.찾은상품.desc}</div>
    } else if (props.누른탭 === 1){
        return <div>It will be updated later.</div>
    } else if (props.누른탭 === 2){
        return <div>It will be updated later.</div>
    }
}

export default Detail;