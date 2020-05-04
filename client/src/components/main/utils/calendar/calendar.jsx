import React, { useEffect, useState } from 'react';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import $ from 'jquery';
import '../../../../styles/calendar.scss';
import {
    fillWeekDays,
    weekID,
    addTimeDataToElement,
    disableDatesBeforeToday,
    addActiveElements
} from "./useCalendar.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import TableCell from '@material-ui/core/TableCell';

export function Calendar(props) {
    // Alldate keeps each week with unique key (year + week number) with weekID() function.
    // Inside that it keeps checkbox value for get next 4 weeks and all the selected dates.
    const [allDate, setAllDate] = useState({
        [weekID()]: {
            checkbox: false,
            dates: [],
        }
    });

    // PickedDates are the Set of all selected dates from 'allDate' + extra days if checkbox is true.
    // const [any, setPickedDates] = useState(new Set([]));

    // useEffect runs when component is mounted
    useEffect(() => {
        if (!props.isTeacher) {
            $('.checkbox').css('display', 'none');
        }
        // Fills first row with date, month and week name.
        fillWeekDays();
        // Adds date attribute(month,day and hour) to each pickable cells in the table.
        addTimeDataToElement();
        // Checks if the cells are not in past. If it's adds 'disabled' class to cells, so it's not clickable.
        disableDatesBeforeToday(props.isTeacher, props.datesDict);
    }, [])


    // Buttons click handler for changing week forward and backward
    const onClickHandlerWeekChange = value => {

        // Fills first row with date, month and week name.
        fillWeekDays(value);
        // Adds date attribute(month,day and hour) to each pickable cells in the table.
        addTimeDataToElement();
        // Checks if the cells are not in past. If it's adds 'disabled' class to cells, so it's not clickable.
        disableDatesBeforeToday(props.isTeacher, props.datesDict);

        // If user choose some dates and goes to next week, it removes all previous active classes
        // to show user blank week.
        for (let item of $(".active")) {
            $(item).removeClass("active");
        }

        // If user choose dates in week and revisits that week again, it iterates through state
        // and if user picked any dates from that week, adds active class.
        let weekIDkeys = Object.keys(allDate);
        for (let key of weekIDkeys) {
            if (key === weekID()) {
                for (let el of allDate[key].dates) {
                    const activeElement = $(`[date='${el}']`);
                    if (!activeElement.hasClass("disabled")) {
                        activeElement.addClass("active");
                    }
                }
            }
        }

        // Sets new dates and checkbox condition to object which has current week id.
        setAllDate(prevState => {

            // If user visits the week for the first time, checkbox is false,
            // and if user visits and change checkbox value, I get that value from previous State
            let checkboxVal;

            if (!prevState[weekID()]) {
                checkboxVal = false;
            } else {
                checkboxVal = prevState[weekID()].checkbox;
            }
            return {
                ...prevState,
                [weekID()]: {
                    checkbox: checkboxVal,
                    dates: [...addActiveElements()]
                }
            };
        });
    };


    // Triggers when user click any cell that is pickable
    const onClickHandlerCalendar = e => {
        const { target } = e;
        if (target.classList.contains("pickable") && !target.classList.contains("disabled")) {
            $(target).toggleClass("active");
        }

        // Setting state on every click from user 
        setAllDate(prevState => {
            let checkboxVal;
            if (!prevState[weekID()]) {
                checkboxVal = false;
            } else {
                checkboxVal = prevState[weekID()].checkbox;
            }
            return {
                ...prevState,
                [weekID()]: {
                    checkbox: checkboxVal,
                    dates: [...addActiveElements()]
                }
            };
        });
    };


    const onChangeHandlerCheckBox = () => {

        // Updates state when checkbox is clicked
        setAllDate(prevState => {
            return {
                ...prevState,
                [weekID()]: {
                    checkbox: !prevState[weekID()].checkbox,
                    dates: [...addActiveElements()]
                }
            }
        })
    }

    // It runs through allDate object and checks object with unique key if checkbox is true or not. 
    // If it's true adds next four weeks to array and destruct that array in pickedDate state.

    const getPickedDays = () => {
        let daysWithNoCheckboxTrue = [];
        let newPickedDates = [];
        let pickedDictionary = {}
        let objKeys = Object.keys(allDate);

        for (let stateWeekID of objKeys) {
            const prop = allDate[stateWeekID];

            for (let dateItem of prop.dates) {
                const itemYear = weekID().slice(0, 4);
                const itemHour = dateItem.split("-")[0];
                const itemDayOld = dateItem.split("-")[1].split(".")[0];
                const itemMonthOld = dateItem.split("-")[1].split(".")[1];
                let dateArr = [];

                const itemDay = itemDayOld < 10 ? "0" + itemDayOld : itemDayOld;
                const itemMonth = itemMonthOld < 10 ? "0" + itemMonthOld : itemMonthOld;
                if (props.isTeacher) {

                    if (prop.checkbox === true) {
                        let addedWeekDate = new Date(itemYear, itemMonth - 1, itemDay);

                        let local = "en-US";
                        let options = {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric"
                        };

                        for (let i = 0; i < 4; i++) {
                            addedWeekDate.setDate(addedWeekDate.getDate() + 7);
                            dateArr.push(addedWeekDate.toLocaleDateString(local, options));
                        }

                        const pickedDate = itemYear + "-" + itemMonth + "-" + itemDay + "T" + itemHour;

                        for (let item of dateArr) {
                            const slicedItem = item.split("/");
                            let dayOld = slicedItem[1];
                            let monthOld = slicedItem[0];
                            let year = slicedItem[2];

                            const day = dayOld < 10 ? "0" + dayOld : dayOld;
                            const month = monthOld < 10 ? "0" + monthOld : monthOld;

                            const next4Week = year + "-" + month + "-" + day + "T" + itemHour;
                            newPickedDates.push(next4Week, pickedDate);
                        }
                    }
                    else {
                        daysWithNoCheckboxTrue.push(itemYear + "-" + itemMonth + "-" + itemDay + "T" + itemHour);
                        newPickedDates.push(...daysWithNoCheckboxTrue);
                    }
                }
                else {
                    let pickedDates = new Date(`${itemYear} ${itemMonth} ${itemDay} ${itemHour}`)

                    for (let key of Object.keys(props.datesDict)) {
                        const dictDate = new Date(key)

                        if (pickedDates.getTime() === dictDate.getTime()) {
                            pickedDictionary[`${dictDate.getDate()}.${dictDate.getMonth() + 1} ${dictDate.getHours()}:00`] = props.datesDict[key]
                        }
                    }
                }
            }
        }
        if (props.isTeacher) {
            const uniqueDates = new Set(newPickedDates);
            props.confirmHandler(Array.from(uniqueDates));
        } else {
            props.confirmHandler(pickedDictionary);
        }
    };

    //     if (dateItem === prop.dates[Object.keys(prop.dates)[Object.keys(prop.dates).length - 1]]
    //         && item === dateArr[dateArr.length - 1]) {

    //         setPickedDates(prev => {
    //             const newPickedDates = new Set([...prev, next4Week, pickedDate]);
    //             return newPickedDates;
    //         });
    //     } else {
    //         setPickedDates(prev => {
    //             return new Set([...prev, next4Week, pickedDate]);
    //         });
    //     }
    // }
    //         daysWithNoCheckboxTrue.push(itemYear + "-" + itemMonth + "-" + itemDay + "T" + itemHour);

    //         if (dateItem === prop.dates[Object.keys(prop.dates)[Object.keys(prop.dates).length - 1]]) {
    //             setPickedDates(prev => {
    //                 const newPickedDates = new Set([...prev, ...daysWithNoCheckboxTrue]);
    //                 props.confirmHandler(Array.from(newPickedDates))
    //                 return newPickedDates
    //             });
    //         } else {
    //             setPickedDates(prev => {
    //                 return new Set([...prev, ...daysWithNoCheckboxTrue]);
    //             });
    //         }
    //     }
    // }
    //     }


    const onClickHandlerSubmit = () => {
        getPickedDays();
    }

    return (
        <div className="calendar-component">
            <div className="container">
                <div className="calendar-header">
                    <div className="btn left" onClick={() => onClickHandlerWeekChange('goLeft')}><ArrowBackIosIcon className="fas fa-chevron-left" /></div>
                    <h2 className="calendar-header--title">{""}</h2>
                    <div className="btn right" onClick={() => onClickHandlerWeekChange('goRight')}><ArrowForwardIosIcon className="fas fa-chevron-right" /></div>
                </div>
                <TableContainer className="calendar-table">
                    <Table size="small" stickyHeader onClick={e => onClickHandlerCalendar(e)}>
                        <TableHead className='thead'>
                            <TableRow className="week-days">
                                <TableCell>שבת</TableCell>
                                <TableCell>שישי</TableCell>
                                <TableCell>חמישי</TableCell>
                                <TableCell>רביעי</TableCell>
                                <TableCell>שלישי</TableCell>
                                <TableCell>שני</TableCell>
                                <TableCell>ראשון</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow className='0-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">08:00</TableCell>
                            </TableRow>
                            <TableRow className='1-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">09:00</TableCell>
                            </TableRow>
                            <TableRow className='2-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">10:00</TableCell>
                            </TableRow>
                            <TableRow className='3-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">11:00</TableCell>
                            </TableRow>
                            <TableRow className='4-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">12:00</TableCell>
                            </TableRow>
                            <TableRow className='5-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">13:00</TableCell>
                            </TableRow>
                            <TableRow className='6-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">14:00</TableCell>
                            </TableRow>
                            <TableRow className='7-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">15:00</TableCell>
                            </TableRow>
                            <TableRow className='8-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">16:00</TableCell>
                            </TableRow>
                            <TableRow className='9-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">17:00</TableCell>
                            </TableRow>
                            <TableRow className='10-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">18:00</TableCell>
                            </TableRow>
                            <TableRow className='11-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">19:00</TableCell>
                            </TableRow>
                            <TableRow className='12-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">20:00</TableCell>
                            </TableRow>
                            <TableRow className='13-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">21:00</TableCell>
                            </TableRow>
                            <TableRow className='14-row'>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="pickable"></TableCell>
                                <TableCell className="time">22:00</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <FormControlLabel
                    control={<Checkbox date={weekID()} checked={allDate[weekID()].checkbox} onChange={onChangeHandlerCheckBox} name="checkbox" />}
                    label="בחר 4 שבועות קדימה"
                />
                <button className="confirm btn" onClick={onClickHandlerSubmit}>שלח</button>
            </div>
        </div>
    )
} 