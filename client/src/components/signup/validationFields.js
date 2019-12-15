export const validEmailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
export const onlyNumbers = RegExp(/^[0-9\b]+$/);
export const onlyEnglishAndHebrew = RegExp(/^[A-Za-z\u0590-\u05fe]+$/i)
export const error_default_messages = {
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
    Object.values(errors).forEach(error=>
         // if we have an error string set valid to false, will be true if val is not null
         error && (valid = false)
             
    );
    return valid;
}

export function check_and_assign_errors(name, value, temp_errors) {
    console.log(temp_errors);
    switch(name) {
        case 'email':
            !validEmailRegex.test(value) ? temp_errors.email_error = error_default_messages.email_error : temp_errors.email_error = null;
            break;
        case 'id_number':
            (value.length !== 9 || !onlyNumbers.test(value)) ?  temp_errors.id_number_error = error_default_messages.id_number_error : temp_errors.id_number_error = null
            break;
        case 'password':
                (value.length < 4) ? temp_errors.password_error = error_default_messages.password_error : temp_errors.password_error = null
                break;
        case 'year':
                (!value) ?  temp_errors.year_error = error_default_messages.year_error :  temp_errors.year_error = null 
                break;
        case 'tel_number':
                (value.length !== 10 || !onlyNumbers.test(value)) ? temp_errors.tel_number_error = error_default_messages.tel_number_error :  temp_errors.tel_number_error = null
                break;
        case 'gender':
                (value !== 'male' && value!=='female') ? temp_errors.gender_error = error_default_messages.gender_error :  temp_errors.gender_error = null
                break;
        case 'first_name':
                (value.length < 2 || !onlyEnglishAndHebrew.test(value)) ? temp_errors.first_name_error = error_default_messages.first_name_error :temp_errors.first_name_error = null
                break;
        case 'last_name':
                (value.length < 2 || !onlyEnglishAndHebrew.test(value)) ? temp_errors.last_name_error = error_default_messages.last_name_error : temp_errors.last_name_error = null;
                break;
        default:
        break;
    }
    return temp_errors
}
