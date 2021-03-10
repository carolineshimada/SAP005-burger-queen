import React, { useEffect, useState, useCallback } from 'react';
import Grid from '@material-ui/core/Grid';
import {useStyles, NavBarKitchen} from '../../components.js';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Copyright from '../../services/Copyright';

function Kitchen (){
  const classes = useStyles();
  const tokenLocal = localStorage.getItem('token');

  const [order, setOrder] = useState([])
  const [orderProduct, setOrderProduct] = useState([])
  const [list, setList] = useState([])

  const [open, setOpen] = React.useState(false);
  const [itemIdOrder, setItemIdOrder] = useState();
  
  
  const orderId = useCallback (() => {
    
    fetch(`https://lab-api-bq.herokuapp.com/orders/${itemIdOrder}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `${tokenLocal}`,
      },
    })       
    
    .then((response) => response.json())
      .then((data) => {
        const productItem = data.Products
        setOrderProduct(productItem)
        setOrder(data)

      });
    
  },[tokenLocal, itemIdOrder])

  function orderPut () {
    
    fetch(`https://lab-api-bq.herokuapp.com/orders/${itemIdOrder}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        'accept': 'application/json',
        'Authorization': `${tokenLocal}`,
      },
      body: JSON.stringify(order)
    })       
    
    .then((response) => response.json())
  }

  const Kitchen = useCallback (() => {
    
    fetch('https://lab-api-bq.herokuapp.com/orders', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `${tokenLocal}`,
      },
    })       
    
    .then((response) => response.json())
      .then((data) => {
        const dados = data.filter(product => product.status === 'pending')

        setList(dados)    
      });
    
  }, [tokenLocal])

  useEffect(() => {
    Kitchen()
  }, [Kitchen])

  useEffect(() => {
    orderId()
    
  }, [itemIdOrder])

  const handleOpen = (e) => {
    e.preventDefault()
    const product = e.target.parentNode;
    const idProduct = Number(product.getAttribute('id'))

    setItemIdOrder(idProduct)  
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCompleted = (e) => {
    window.confirm("O pedido foi concluido?")
    e.preventDefault()

    setOrder(order.status = 'done')
    orderPut ()
  };  


  return (
    <div className='pending'>
      <NavBarKitchen/>  

      <Grid id='menuList'className='containerKitchen' >  
        {list.map (function (product, index) {
          return(
            <div  key={index} id={product.id}>   
                <button  type='button' className={classes.submitKitchen} onClick={handleOpen} 
                cursor='pointer'>Pedido n°{product.id} <br></br> Status:  {product.status.replace('pending', 'Pendente')} </button>
                <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                className={classes.modal}
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                  timeout: 500,
                }}> 
                <Fade in={open}  style={{overflowX : 'auto',fontSize: '20px'}} >
                  <div className={classes.submitMenuCardsModal} status={product.status}>
                    <span><p>Pedido n° {order.id} <br></br> Cliente:{order.client_name} <br></br>Mesa: {order.table}<br></br>Status:{product.status.replace('pending', 'Pendente')} </p> </span>
                    <span>{orderProduct.map (function (item, index) {
                      return(
                        <div key={index}>
                          <p>{item.qtd} {item.name} {item.flavor === 'null' ? '' : item.flavor} {item.complement === 'null' ? '' : item.complement }</p>
                        </div> 
                      )
                    })}</span>
                    <Button variant="contained"
                      color="primary"
                      className={classes.button}
                      endIcon={<Icon>send</Icon>} onClick={handleCompleted}>Concluir
                    </Button> 
                  </div>
                </Fade>
              </Modal>  
            </div>          
          )
        })}
      </Grid>
      <p className='colorW'><Copyright/></p>
    </div>
  )
}

export default Kitchen;