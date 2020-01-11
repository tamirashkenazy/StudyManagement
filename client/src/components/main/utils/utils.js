import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export function Dialog_generator(open, onClose, title, props, component){
    const rtl_style = {direction : "rtl", textAlign:"right"}
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <DialogTitle style={rtl_style} id="form-dialog-title">{title}</DialogTitle>
            <DialogContent style={rtl_style}>
            {component(props)}
            </DialogContent>
        </Dialog>
    )
}