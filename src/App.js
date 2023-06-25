import React, { Suspense, lazy, useState, useMemo, useEffect } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import bg from './img/background.jpg'
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';
// import Detail from './routes/Detail.js';
// import Cart from './routes/Cart.js';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useQuery } from "react-query"
//import { css } from '@emotion/core';
//import { DotLoader } from 'react-spinners';



const Detail = lazy(() => import('./routes/Detail.js'));
const Cart = lazy(() => import('./routes/Cart.js'));

function App() {

  // let obj = { name: 'namu' }
  // localStorage.setItem('data', JSON.stringify(obj));
  // let 꺼낸거 = localStorage.getItem('data');
  
  let [ products, products변경 ] = useState([]);
  let [ productListCount, productListCount변경 ] = useState(null);
  let [ pageNo, pageNo변경 ] = useState(1);
  let [ pageSize, pageSize변경 ] = useState(6);
  let [ offset, offset변경 ] = useState(0);

  let [ 정렬토글, 토글변경 ] = useState(false);
  let [ 로딩, 로딩중 ] = useState(false);

  let navigate = useNavigate();

  let result = useQuery('작명', () => 
    axios.get('https://codingapple1.github.io/userdata.json').then((a) => {
      return a.data
    }),
    { staleTime : 2000 }
  )

  // const override = css`
  //   display: block;
  //   margin: 0 auto;
  //   border-color: red;
  // `;


  useMemo(()=>{
    if(localStorage.getItem('watched') === undefined || localStorage.getItem('watched') === null ){
      localStorage.setItem('watched', JSON.stringify( [] ))
      return;
    }
    
    let newArray = JSON.parse(localStorage.getItem('watched'));
    newArray.sort((a,b) => a - b);
    
    var recentProducts = [...newArray];

    toast.success(`Recent viewed product : ${recentProducts}`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000
    });
  },[]) 

  //useEffect(()=>{
  useMemo(()=>{
    axios.get('http://localhost:8080/api/ProductListGetCountAll')
      .then(result1 => {
        let productListCountVal = result1.data[0].count;
        productListCount변경(productListCountVal);
        let offsetVal = productListCountVal - pageSize * (pageNo - 1);
        offset변경(offsetVal);

        axios.post('http://localhost:8080/api/ProductListGetByPage', {
          offset: offset,
          pageSize: pageSize
        })
        .then((result2) => { 
          로딩중(false);
          products변경([...products, ...result2.data]);
          pageNo변경(pageNo+1);
        })
        .catch(() => {
          로딩중(false);
          console.log('Get List Failed')
        }); 
      })
      .catch(() => {
        로딩중(false);
        console.log('Get Count Failed')
      }); 
  }, [productListCount, offset])

  return (
    <div className="App">
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand as={Link} to="/">Namu Shop</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            { result.isLoading && 'Loading..' }
            { result.error && 'Error' }
            {/* { result.data && result.data.name } */}
            { result.data && 'Guest' }
          </Nav>
        </Container>
      </Navbar>

      <Suspense fallback={<div>Loading...</div>}>
        <ToastContainer />
        <Routes>
          {/* <Route exact path="/"> */}
          <Route path="/" element=
            {
              <>
                <div className="background">
                  <h1>20% Season Off</h1>
                  <p>
                    You can get a new discount of 20% only if you purchase now.
                  </p>
                </div>
                <Button variant="primary" onClick = { () => {순서바꾸기(정렬토글)} }>Change by price</Button>
                <div className="container mt-5">
                  <div className="row">
                    {
                      로딩 === true ? <div><h4>Loading...</h4></div> :
                      //로딩 === true ? <DotLoader css={override} size={150} color={'#123abc'} loading={로딩} /> :
                      
                      products.map((a, i) => {
                        return <Card products={products[i]} i={i} key={i}/>
                      })
                    }
                  </div>
                </div>
                {(productListCount - pageSize * (pageNo - 1) )> 0 && (

                  <button className="btn btn-primary mb-5" onClick={ () => { 
                    로딩중(true);
                    let offsetVal = productListCount - pageSize * (pageNo - 1);
                    offset변경(offsetVal);
                    
                    axios.post('http://localhost:8080/api/ProductListGetByPage', {
                      offset: offset,
                      pageSize: pageSize
                    })
                    .then((result2) => { 
                      
                      로딩중(false);
                      
                      products변경([...products, ...result2.data]);
                      pageNo변경(pageNo+1);
                    })
                    .catch(() => {
                      로딩중(false);
                      console.log('Get List Failed')
                    }); 
                  }}>See more</button>
                )}
              </>
            } 
          />
          
          <Route path="/detail/:no" element={
            <>
              <Detail products={products}/>
            </>
          }/>
          
          <Route path="/cart" element={
            <Cart />
          }/>
            
          <Route path="/:id" element={
            <div>Page Not Found</div>
          }/>
        </Routes>
        {/* <DotLoader css={override} size={150} color={'#123abc'} loading={로딩} /> */}
      </Suspense>
    </div>
  );

  function 순서바꾸기(정렬토글){
    var newArray = [...products];
      
      if(!정렬토글){
        newArray.sort(function (a,b){
          if( a.listPrice > b.listPrice ) return 1;
          if( a.listPrice < b.listPrice ) return -1;
          return 0;
        });
      }
      else{
        newArray.reverse();
      }
    
      토글변경(!정렬토글);
      products변경( newArray );
  }
}

function Card(props) {
  //let history = useHistory();
  let navigate = useNavigate();

  return (
      // <div className="col-md-4" onClick={() => { history.push('/detail/'+ props.products.no) }}>
      <div className="col-md-4" onClick={() => { navigate('/detail/'+ props.products.no) }}>
        <img src={ props.products.productImageUrl } width="50%" height="50%" />
        <h4>{props.products.no}.{ props.products.name }</h4>
        <p> Price : ¥{ props.products.listPrice} <br/> Stock : { props.products.qty} </p>
      </div>
  )
}

export default App;