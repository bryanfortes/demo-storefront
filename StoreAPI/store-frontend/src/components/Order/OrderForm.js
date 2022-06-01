import React,{useState, useEffect} from 'react'
import Form from "../../layouts/Form"
import {Button as MuiButton, ButtonGroup, Grid, InputAdornment, makeStyles} from "@material-ui/core";
import{Input, Select, Button} from "../../controls";
import ReplayIcon from '@material-ui/icons/Replay'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ReorderIcon from '@material-ui/icons/Reorder';
import {createAPIEndpoint, ENDPOINTS} from "../../api";
import {useForm} from "../../hooks/useForm";

const paymentMethods = [
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

    const {values, errors, handleInputChange} = props;
    const classes = useStyles();

    const [customerList, setCustomerList] = useState([])

    useEffect(()=>{
        createAPIEndpoint(ENDPOINTS.CUSTOMER).fetchAll()
            .then(res =>{
                let customerList = res.data.map(item => ({
                    id: item.customerId,
                    title: item.customerName
                }));
                customerList = [{id: 0, title: 'Select'}].concat(customerList);
                setCustomerList(customerList)
            })
            .catch(err=> console.log(err))
    }, [])



    return(
        <Form>
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
                        />
                </Grid>
                <Grid item xs={6}>
                    <Select
                        label={'Payment Method'}
                        name={'payment'}
                        onChange = {handleInputChange}
                        options={paymentMethods}
                        value={values.payment}
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
                            startIcon={<ReplayIcon/>}>

                        </MuiButton>
                    </ButtonGroup>
                    <Button size={'large'}
                    startIcon={<ReorderIcon />}
                    >Orders</Button>
                </Grid>
            </Grid>
    </Form>
)
}