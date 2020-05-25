import React from 'react';
import MaterialIcon from 'material-icons-react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';

export function Dialog_generator(open, onClose, title, icon, args, Component, styles) {
    //options for maxWidth are: "xs" , "sm", "md", "lg", "xl"
    let maxWidth="md", direction="rtl", height
    if (styles) {
        maxWidth = styles.maxWidth ? styles.maxWidth : "md"
        direction = styles.direction ? styles.direction : "rtl"
        height = styles.height
    }
    const card = styles === "card" ? true : false;
    const display_header = title || icon ? true : false;
    const rtl_style_title = { direction: "rtl", textAlign: "center", padding: display_header? null:"0", paddingBottom : "0px"}
    const rtl_style_content = { direction: direction, textAlign: "center", height : height, padding: display_header? null:"0"}

    return (
        <Dialog open={open} onClose={onClose} fullWidth={card? false: true } maxWidth={maxWidth}>
            {display_header ? <DialogTitle style={rtl_style_title} > <Typography display="inline" component={'span'} variant={'h4'} >{title} </Typography><MaterialIcon icon={icon} color='#37474f' /> 
            <hr color="black"/>
            </DialogTitle>: null}
            <DialogContent style={rtl_style_content}>
                {Component(args)}
            </DialogContent>
        </Dialog>
    )
}


export const getOpenedPopup = (num_of_popup, total_popups) => {
    let true_false_by_index = {}
    let i;
    for (i=0; i < total_popups; i++){
        if (i===num_of_popup) {
            true_false_by_index[i] = true
        } else {
            true_false_by_index[i] = false
        }

    }
    return true_false_by_index
}

export const closeAllPopups = (total_popups) => {
    let true_false_by_index = {}
    let i;
    for (i=0; i < total_popups; i++){
        true_false_by_index[i] = false
    }
    return true_false_by_index
}