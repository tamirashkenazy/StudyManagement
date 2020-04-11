import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export function Dialog_generator(open, onClose, title, args, Component, maxWidth="md", direction="rtl"){
    // console.log(props);
    // const {open, onClose, title, args, Component} = props
    // let {maxWidth} = props
    // if (!maxWidth) {
    //     maxWidth = "md"
    // }
    //options for maxWidth are: "xs" , "sm", "md", "lg", "xl"
    const rtl_style = {direction : direction, textAlign:"center"}
    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={maxWidth}>
            <DialogTitle style={rtl_style}>{title}</DialogTitle>
            <DialogContent style={rtl_style}>
                {Component(args)}
            </DialogContent>
        </Dialog>
    )
}