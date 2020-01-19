import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export function Dialog_generator(open, onClose, title, props, component, maxWidth="md"){
    //options for maxWidth are: "xs" , "sm", "md", "lg", "xl"
    const rtl_style = {direction : "rtl", textAlign:"center"}
    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={maxWidth}>
            <DialogTitle style={rtl_style}>{title}</DialogTitle>
            <DialogContent style={rtl_style}>
            {component(props)}
            </DialogContent>
        </Dialog>
    )
}