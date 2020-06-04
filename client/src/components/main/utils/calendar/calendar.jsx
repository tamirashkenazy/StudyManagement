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

var DATES_COUNTER = 0;
export function Calendar(props) {
    let disabled = ((DATES_COUNTER <= 0) || (DATES_COUNTER > props.maxNumber)) ? true : false;
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
        //eslint-disable-next-line react-hooks/exhaustive-deps
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
            DATES_COUNTER = target.classList.contains("active") ? DATES_COUNTER + 1 : DATES_COUNTER - 1;
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

    const onChangeHandlerCheckBox = (event) => {
        if (event.target.checked) {
            $('.btn-right').css('display', 'none');
            $('.btn-left').css('display', 'none');
        } else {
            $('.btn-right').css('display', 'block');
            $('.btn-left').css('display', 'block');
        }
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
                if (dateItem === undefined || dateItem === null) {
                }
                else {
                    const itemYear = weekID().slice(0, 4);
                    const itemHourOld = dateItem.split("-")[0];
                    const itemDayOld = dateItem.split("-")[1].split(".")[0];
                    const itemMonthOld = dateItem.split("-")[1].split(".")[1];
                    let dateArr = [];

                    const itemDay = itemDayOld < 10 ? "0" + itemDayOld : itemDayOld;
                    const itemMonth = itemMonthOld < 10 ? "0" + itemMonthOld : itemMonthOld;
                    const itemHour = itemHourOld < 10 ? "0" + itemHourOld : itemHourOld;

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

                            const pickedDate = itemYear + "-" + itemMonth + "-" + itemDay + "T" + itemHour + "Z";

                            for (let item of dateArr) {
                                const slicedItem = item.split("/");
                                let dayOld = slicedItem[1];
                                let monthOld = slicedItem[0];
                                let year = slicedItem[2];

                                const day = dayOld < 10 ? "0" + dayOld : dayOld;
                                const month = monthOld < 10 ? "0" + monthOld : monthOld;

                                const next4Week = year + "-" + month + "-" + day + "T" + itemHour + "Z";
                                newPickedDates.push(next4Week, pickedDate);
                            }
                        }
                        else {
                            daysWithNoCheckboxTrue.push(itemYear + "-" + itemMonth + "-" + itemDay + "T" + itemHour + "Z");
                            newPickedDates.push(...daysWithNoCheckboxTrue);
                        }
                    }
                    else {
                        let pickedDates = new Date(`${itemYear} ${itemMonth} ${itemDay} ${itemHour}`)

                        for (let key of Object.keys(props.datesDict)) {
                            const dictDate = new Date(key)

                            if (pickedDates.getTime() === dictDate.getTime()) {
                                const day = dictDate.getDate() < 10 ? "0" + dictDate.getDate() : dictDate.getDate();
                                const month = ((dictDate.getMonth() + 1) < 10) ? "0" + (dictDate.getMonth() + 1) : (dictDate.getMonth() + 1);
                                const hour = dictDate.getHours() < 10 ? "0" + dictDate.getHours() : dictDate.getHours();

                                pickedDictionary[`${dictDate.getFullYear()}-${month}-${day}T${hour}:00`] = props.datesDict[key]
                            }
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

    const onClickHandlerSubmit = () => {
        getPickedDays();
    }

    const days = ['שבת', 'שישי', 'חמישי', 'רביעי', 'שלישי', 'שני', 'ראשון', ' ']
    const cells = ['', '', '', '', '', '', '']
    const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];
    return (
        <div className="calendar-component">
            <div className="container">
                <div className="calendar-header">
                    <div className="btn-left" onClick={() => onClickHandlerWeekChange('goLeft')}><ArrowBackIosIcon className="fas fa-chevron-left" /></div>
                    <h1 className="calendar-header--title">{""}</h1>
                    <div className="btn-right" onClick={() => onClickHandlerWeekChange('goRight')}><ArrowForwardIosIcon className="fas fa-chevron-right" /></div>
                </div>
                <TableContainer>
                    <Table size="small" stickyHeader className="calendar-table" onClick={e => onClickHandlerCalendar(e)}>
                        <TableHead className='thead'>
                            <TableRow className="week-days">
                                {days.map((value, index) => {
                                    return <TableCell key={index}>{value}</TableCell>
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                hours.map((el,index) => {
                                    var name = index + "-row";
                                    return <TableRow className={name} key={index} >
                                        {cells.map((value, index) => {
                                            return <TableCell className="pickable" key={index}>{value}</TableCell>
                                        })}
                                        <TableCell className="time">{el}</TableCell>
                                    </TableRow>
                                })
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
                <FormControlLabel className="checkbox"
                    control={<Checkbox date={weekID()} checked={allDate[weekID()].checkbox} onChange={onChangeHandlerCheckBox} name="checkbox" />}
                    label="בחר 4 שבועות קדימה"
                />
                <button className="confirm btn" onClick={onClickHandlerSubmit} disabled={disabled} >עדכן</button>
            </div>
        </div>
    )
} 
