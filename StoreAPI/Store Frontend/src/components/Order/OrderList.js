import React, {useEffect, useState} from 'react'
import {createAPIEndpoint,ENDPOINTS} from "../../api";
import Table from "../../layouts/Table"
import {TableBody, TableCell, TableHead, TableRow} from "@material-ui/core";
import DeleteOutlineTwoToneIcon from '@material-ui/icons/DeleteOutlineTwoTone';


export default function OrderList(props){
    const {setOrderId, setOrderListVisibility, resetFormControls,setNotify} = props;
    const[orderList, setOrderList] = useState([]);

    useEffect(()=>{
    createAPIEndpoint(ENDPOINTS.ORDER).fetchAll()
        .then(res=>{
            setOrderList(res.data);
        })
        .catch(err=>console.log(err))
    },[])

    const showForUpdate = id =>{
        setOrderId(id);
        setOrderListVisibility(false);
    }

    const deleteOrder = id =>{
        if(window.confirm('Are you sure you want to delete this order?')){
            createAPIEndpoint(ENDPOINTS.ORDER).delete(id)
                .then(res=>{
                    setOrderListVisibility(false);
                    setOrderId(0);
                    resetFormControls();
                    setNotify({isOpen: true, message:'Order deleted successfully.'});
                })
                .catch(err=>console.log(err))

        }
    }

    return(<Table>
        <TableHead>
            <TableRow>
                <TableCell>Order No.</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell>Total</TableCell>
                <TableCell></TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {
                orderList.map(item =>(
                    <TableRow key={item.orderLedgerId}>
                        <TableCell
                        onClick={e=> showForUpdate(item.orderLedgerId)}>
                            {item.orderNumber}
                        </TableCell>
                        <TableCell
                            onClick={e=> showForUpdate(item.orderLedgerId)}>
                            {item.customer.customerName}
                        </TableCell>
                        <TableCell
                            onClick={e=> showForUpdate(item.orderLedgerId)}>
                            {item.payment}
                        </TableCell>
                        <TableCell
                            onClick={e=> showForUpdate(item.orderLedgerId)}>
                            {'$'+item.total}
                        </TableCell>
                        <TableCell>
                            <DeleteOutlineTwoToneIcon
                                onClick={e=> deleteOrder(item.orderLedgerId)}
                            color={'secondary'}/>
                        </TableCell>
                    </TableRow>
                ))
            }
        </TableBody>
    </Table>)
}