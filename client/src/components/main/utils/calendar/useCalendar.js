import $ from 'jquery';

let date = new Date();

export const getFullWeekDate = (value) => {
    let week = [];

    // Go to Sunday
    date.setDate(date.getDate() - date.getDay());

    // change locale where you want
    let local = "en-US";
    let options = {
        weekday: "long",
        day: "numeric",
        month: "numeric",
        year: "numeric"
    };

    // "Sunday, 3/15/2020"
    // "יום ראשון, 15.3.2020"


    for (let i = 0; i < 7; i++) {
        if (value === "goLeft") {
            if (!i) {
                date.setDate(date.getDate() + 7);
                week.push(date.toLocaleDateString(local, options));
                continue;
            }
            date.setDate(date.getDate() + 1);
        } else if (value === "goRight") {
            date.setDate(date.getDate() - 1);
        } else {
            if (!i) {
                date.setDate(date.getDate());
            } else {
                date.setDate(date.getDate() + 1);
            }
        }

        week.push(date.toLocaleDateString(local, options));
    }

    return week;
};

// gets a array from getFullWeekDate() and iterate through.
// Divides into related part(weekName, month, day, year)
// And finds the element by it's default weekName (that's hardcoded in jsx).
// Also year is added in here to DOM.
export const fillWeekDays = (value) => {
    let week = getFullWeekDate(value);

    for (let i = 0; i < 7; i++) {
        let weekDates = week[i].split("/");

        let weekName = weekDates[0].substr(0, weekDates[0].indexOf(","));
        let month = weekDates[0].substr(weekDates[0].indexOf(" ") + 1);
        let day = weekDates[1];
        let year = weekDates[2];

        const daysTranslation = {
            'Sunday': 'ראשון',
            'Monday': 'שני',
            'Tuesday': 'שלישי',
            'Wednesday': 'רביעי',
            'Thursday': 'חמישי',
            'Friday': 'שישי',
            'Saturday': 'שבת',
        };

        $(`th:contains('${daysTranslation[weekName]}')`).html(day + "." + month + " " + daysTranslation[weekName]);
        $(".calendar-header--title").html(year);
    }
};
fillWeekDays();
// New methods added to the Date object for creating unique objects.
// eslint-disable-next-line no-extend-native
Date.prototype.getWeek = function () {
    let date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Sunday in current week decides the year.
    date.setDate(date.getDate() - (date.getDay() - 1));
    // January 4 is always in week 1.
    let week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Sunday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

// Returns the four-digit year corresponding to the ISO week of the date.
// eslint-disable-next-line no-extend-native
Date.prototype.getWeekYear = function () {
    let date = new Date(this.getTime());
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    return date.getFullYear();
}

// Returns unique key. Year + the which week it's currently. Such as 202012 for March from 15th to 21th
export const weekID = () => {
    return date.getWeekYear() + '' + date.getWeek();
}


// Creates attribute for each cell that's pickable. They are also unique and whole process goes on it.
export const addTimeDataToElement = () => {
    const weekDays = $(".calendar-table").find(".week-days").children();

    for (let i = 0; i < 15; i++) {
        const row = $($(`.${i}-row`)[0]).children();

        for (let item of row) {
            const date = $(weekDays[$(item).index()]).html();
            if ($(item).hasClass("pickable")) {
                $(item).attr("date", $(item).parent().find(".time").html() + "-" + date.substr(0, date.indexOf(" ")));
                $(item).attr("week-id", weekID());
            }
        }
    }
};


// Iterate through every cell and get date info from their atributes
// then it creates Date object with those info and compare with today's Date object.
// Then adds disabled class if date is past.

export const disableDatesBeforeToday = (isTeacher, dates) => {

    //clears previous elements with 'disabled' class
    for (let item of $(".pickable")) {
        $(item).removeClass("disabled");

        const date = $(item).attr("date").split("-");

        const itemYear = weekID().slice(0, 4);
        const itemHour = date[0];
        const itemDay = date[1].split(".")[0];
        const itemMonth = date[1].split(".")[1] - 1;

        const cellDate = new Date(itemYear, itemMonth, itemDay, itemHour.split(":")[0], itemHour.split(":")[1]);
        if (!isTeacher) {
            $(item).addClass("disabled");
            for (let key of Object.keys(dates)) {
                const inputDate = new Date(key);

                inputDate.setMinutes(0);
                inputDate.setSeconds(0);
                inputDate.setMilliseconds(0);

                if (cellDate.getTime() === inputDate.getTime()) {
                    $(item).removeClass("disabled");
                    $(item).html(dates[key])
                }
            }
        } else {
            const currentDate = new Date();

            if (cellDate < currentDate) {
                $(item).addClass("disabled");
            }
        }
    }
};

// Gets all active elements from DOM and adds to array.
// This array later will be used in AllDate state object.
export const addActiveElements = () => {
    const activeEl = []
    for (let item of $('.active')) {
        activeEl.push($(item).attr('date'))
    }
    return activeEl
}