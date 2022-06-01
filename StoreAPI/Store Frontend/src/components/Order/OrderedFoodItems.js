import React from 'react'
import {
    Button,
    ButtonGroup,
    IconButton,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Paper
} from "@material-ui/core";
import DeleteTwoToneIcon from "@material-ui/icons/DeleteTwoTone";


export default function OrderedFoodItems(props){

    const {  values, setValues} = props;

    let orderedFoodItems = values.orderDetails;

    const removeFoodItem=(index, id) =>{
        let x = {...values};
        x.orderDetails = x.orderDetails.filter((_,i)=> i != index);
        setValues({...x});
    }

    const updateQuantity =(idx,value) =>{
        let x={...values};
        let foodItem = x.orderDetails[idx];
        if(foodItem.quantity + value > 0) {
            foodItem.quantity += value;
            setValues({...x});
        }
    }

    return(
        <List>
            {
                orderedFoodItems.map((item,idx)=>(
                    <Paper key={idx}>
                        <ListItem>
                            <ListItemText
                                primary={item.foodItemName}
                                primaryTypographyProps={{
                                    component: 'h1',
                                    style: {
                                        fontWeight: '500',
                                        fontSize: '1.2em'
                                    }
                                }}
                                secondary={
                                <>
                                    <ButtonGroup
                                       //className={classes.buttonGroup}
                                        size="small">
                                        <Button
                                            onClick={e => updateQuantity(idx, -1)}
                                        >-</Button>
                                        <Button
                                            disabled
                                        >{item.quantity}</Button>
                                        <Button
                                            onClick={e => updateQuantity(idx, 1)}
                                        >+</Button>
                                    </ButtonGroup>
                                    {/*<span className={classes.totalPerItem}>*/}
                                    {/*        {'$' + roundTo2DecimalPoint(item.quantity * item.foodItemPrice)}*/}
                                    {/*    </span>*/}
                                </>
                            }
                            />
                            <ListItemSecondaryAction>
                                <IconButton
                                disableRipple
                                onClick={e => removeFoodItem(idx,item.orderDetailsId)}
                                >
                                    <DeleteTwoToneIcon/>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </Paper>
                ))
            }
        </List>
    )
}