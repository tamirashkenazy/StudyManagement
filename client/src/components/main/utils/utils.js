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

    const rtl_style_title = { direction: "rtl", textAlign: "center", paddingBottom : "0px"}
    const rtl_style_content = { direction: direction, textAlign: "center", height : height}

    return (
        <Dialog open={open} onClose={onClose} fullWidth={true} maxWidth={maxWidth}>
            <DialogTitle style={rtl_style_title} ><Typography display="inline" variant="h4" >{title} </Typography><MaterialIcon icon={icon} color='#37474f' />
            <hr color="black"/>
            </DialogTitle>
            <DialogContent style={rtl_style_content}>
                {Component(args)}
            </DialogContent>
        </Dialog>
    )
}