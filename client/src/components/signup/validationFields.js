export const validEmailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
export const onlyNumbers = RegExp(/^[0-9\b]+$/);
export const onlyEnglishAndHebrew = RegExp(/^[A-Za-z\u0590-\u05fe]+$/i)
export const errors_messages = {
    id_number: 'הכנס 9 מספרים של ת.ז',
    tel_number:  'מספר טלפון מורכב מ10 תווים',
    password: 'סיסמה לפחות 4 תווים',
    year :'בחר שנת לימודים',
    email :  'אנא הכנס כתובת אימייל',
    gender : 'בחר מין',
    first_name: 'הכנס שם פרטי תקין',
    last_name: 'הכנס שם משפחה תקין',
    role : 'בחר האם הינך מורה או תלמיד או שניהם'
    // role : 'בחר האם הינך מורה או תלמיד או שניהם'
}

export function validateForm(errors)  {
    let valid = true;
    Object.values(errors).forEach(val=>
         // if we have an error string set valid to false, will be true if val is not null
        val && (valid = false)
             
    );
    return valid;
}

export function check_and_assign_errors(name, value, temp_errors) {
    switch(name) {
        case 'email':
            !validEmailRegex.test(value) ? temp_errors.email = errors_messages.email : temp_errors.email = null;
            break;
        case 'id_number':
            (value.length !== 9 || !onlyNumbers.test(value)) ?  temp_errors.id_number = errors_messages.id_number : temp_errors.id_number = null
            break;
        case 'password':
                (value.length < 4) ? temp_errors.password = errors_messages.password : temp_errors.password = null
                break;
        case 'year':
                (!value) ?  temp_errors.year = errors_messages.year :  temp_errors.year = null 
                break;
        case 'tel_number':
                (value.length !== 10 || !onlyNumbers.test(value)) ? temp_errors.tel_number = errors_messages.tel_number :  temp_errors.tel_number = null
                break;
        case 'gender':
                (value !== 'male' && value!=='female') ? temp_errors.gender = errors_messages.gender :  temp_errors.gender = null
                break;
        case 'first_name':
                (value.length < 2 || !onlyEnglishAndHebrew.test(value)) ? temp_errors.first_name = errors_messages.first_name :temp_errors.first_name = null
                break;
        case 'last_name':
                (value.length < 2 || !onlyEnglishAndHebrew.test(value)) ? temp_errors.last_name = errors_messages.last_name : temp_errors.last_name = null;
                break;
        default:
        break;
    }
    return temp_errors
}
