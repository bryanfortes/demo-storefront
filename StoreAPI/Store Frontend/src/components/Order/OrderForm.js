import React,{useState, useEffect} from 'react'
import Form from "../../layouts/Form"
import {Button as MuiButton, ButtonGroup, Grid, InputAdornment, makeStyles} from "@material-ui/core";
import{Input, Select, Button} from "../../controls";
import ReplayIcon from '@material-ui/icons/Replay'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ReorderIcon from '@material-ui/icons/Reorder';
import {createAPIEndpoint, ENDPOINTS} from "../../api";
import {roundTo2DecimalPoint} from "../../utils";
import Popup from "../../layouts/Popup";
import OrderList from "./OrderList";
import Notification from "../../layouts/Notification"

const payments = [
    { id: 'none', title: 'Select' },
    { id: 'Cash', title: 'Cash' },
    { id: 'Card', title: 'Card' },
]

const useStyles = makeStyles(theme => ({
    adornmentText: {
        '& .MuiTypography-root': {
            color: '#f3b33d',
            fontWeight: 'bolder',
            fontSize: '1.5em'
        }
    },
    submitButtonGroup: {
        backgroundColor: '#f3b33d',
        color: '#000',
        margin: theme.spacing(1),
        '& .MuiButton-label': {
            textTransform: 'none'
        },
        '&:hover': {
            backgroundColor: '#f3b33d',
        }
    }
}))


export default function OrderForm(props){

    const {values, setValues, errors,setErrors, handleInputChange, resetFormControls} = props;
    const classes = useStyles();

    const [customerList, setCustomerList] = useState([]);
    const [orderListVisibility,setOrderListVisibility] = useState(false);
    const [orderId, setOrderId] = useState(0);
    const [notify, setNotify] = useState({isOpen: false});

    useEffect(()=>{
        createAPIEndpoint(ENDPOINTS.CUSTOMER).fetchAll()
            .then(res =>{
                let customerList = res.data.map(item => ({
                    id: item.customerId,
                    title: item.customerName
                }));
                customerList = [{id: 0, title: 'Select'}].concat(customerList);
                setCustomerList(customerList);
            })
            .catch(err=> console.log(err))
    }, [])

useEffect(()=>{
    let total = values.orderDetails.reduce((tempTotal,item)=>{
        return tempTotal+(item.quantity * item.foodItemPrice);
    },0);
    setValues({...values,
    total:roundTo2DecimalPoint(total)
    })
}, [JSON.stringify(values.orderDetails)]);

    useEffect(()=>{
        if(orderId === 0) resetFormControls()
        else{
            createAPIEndpoint(ENDPOINTS.ORDER).fetchbyID(orderId)
                .then(res =>{
                    setValues(res.data);
                    setErrors({});
                })
                .catch(err=>console.log(err))
        }

    },[orderId]);

    const validateForm =() =>{
        let temp = {};
        temp.customerId = values.customerId !==0?"": "This field is required.";
        temp.payment = values.payment !=="none"?"": "This field is required.";
        temp.orderDetails = values.orderDetails.length !==0?"":"This field is required.";
        setErrors({...temp});
        return Object.values(temp).every(x => x==="");
    }

    const resetForm=()=>{
        resetFormControls();
        setOrderId(0);
    }

    const submitOrder = e =>{
        e.preventDefault();
        if(validateForm()){
            if(values.orderLedgerId===0) {
                createAPIEndpoint(ENDPOINTS.ORDER).create(values)
                    .then(res => {
                        resetFormControls();
                        setNotify({isOpen: true, message:'New order has been created.'});
                    })
                    .catch(err => console.log(err));
            }
            else {
                createAPIEndpoint(ENDPOINTS.ORDER).update(values.orderLedgerId,values)
                    .then(res => {
                        setOrderId(0);
                        setNotify({isOpen: true, message:'The order has been updated.'});
                    })
                    .catch(err => console.log(err));
            }
            }

    }

    const openListOfOrders=()=>{
        setOrderListVisibility(true);
    }

    return(<>
        <Form onSubmit={submitOrder}>
            <Grid container>
                <Grid item xs={6}>
                    <Input
                        disabled
                        label={'Order Number'}
                        name={'orderNumber'}
                        value={values.orderNumber}
                        InputProps={{
                        startAdornment:<InputAdornment
                        className={classes.adornmentText}
                        position={'start'}>#</InputAdornment>}}
                    />
                    <Select
                        label={'Customer'}
                        name={'customerId'}
                        onChange = {handleInputChange}
                        options={customerList}
                        value={values.customerId}
                        error={errors.customerId}
                        />
                </Grid>
                <Grid item xs={6}>
                    <Select
                        label={'Payment Method'}
                        name={'payment'}
                        onChange = {handleInputChange}
                        options={payments}
                        value={values.payment}
                        error={errors.payment}
                    />
                <Input
                    disabled
                    label={'Grand Total'}
                    name={'total'}
                    value={values.total}
                    InputProps={{
                        startAdornment:<InputAdornment
                        className={classes.adornmentText}
                        position={'start'}>$</InputAdornment>}}
                />
                    <ButtonGroup className={classes.submitButtonGroup}>
                        <MuiButton
                            size={'large'}
                            endIcon={<ShoppingCartIcon />}
                            type={'submit'}>Submit</MuiButton>
                        <MuiButton
                            size={'small'}
                            onClick={resetForm}
                            startIcon={<ReplayIcon/>}>

                        </MuiButton>
                    </ButtonGroup>
                    <Button size={'large'}
                     onClick={openListOfOrders}
                    startIcon={<ReorderIcon />}
                    >Orders</Button>
                </Grid>
            </Grid>
    </Form>
        <Popup
            title={'List of Orders'}
            openPopup={orderListVisibility}
            setOpenPopup={setOrderListVisibility}>
<OrderList
    {...{setOrderId,setOrderListVisibility, resetFormControls, setNotify}}/>
        </Popup>
            <Notification
                {...{notify, setNotify}}/>
        </>
)
}