export const validEmailRegex = RegExp(/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i);
export const onlyNumbers = RegExp(/^[0-9\b]+$/);
export const onlyEnglishAndHebrew = RegExp(/^[A-Za-z\u0590-\u05fe]+$/i)
export const error_default_messages = {
    _id_error: 'ת.ז לא תקנית',
    tel_number_error:  'מספר טלפון מורכב מ10 תווים',
    password_error: 'הסיסמה צריכה להיות לפחות 8 תווים, אות קטנה ומספר',
    year_error :'בחר שנת לימודים',
    email_error :  'אנא הכנס כתובת אימייל',
    gender_error : 'בחר מין',
    first_name_error: 'הכנס שם פרטי תקין',
    last_name_error: 'הכנס שם משפחה תקין',
    role_error : 'בחר האם הינך מורה או תלמיד או שניהם'
}

export function validateForm(errors) {
    let valid = true;
    Object.values(errors).forEach(error=> {
         // if we have an error string set valid to false, will be true if val is not null
        if (error) {
            valid = false
        }
    });
    return valid;
}

export function allFieldsExist(formValues) {
    let allFields = ['_id', 'email', 'password' ,'first_name', 'last_name', 'study_year', 'tel_number', 'gender']
    var hasAllKeys = allFields.every(function(item){
        return formValues.hasOwnProperty(item);
    });
    if ((!formValues.isStudent && !formValues.isTeacher) ){
        hasAllKeys = false
    } else {
        hasAllKeys = true

    }
    return hasAllKeys
}
const is_id_valid_by_algorithm = (id) => {
    id = id.toString();
    if (id.length !== 9 || isNaN(id)) {  // Make sure ID is formatted properly
        return false;
    }
    let sum = 0, incNum;
    for (const i in id) {
        incNum = Number(id[i]) * ((i % 2) + 1);  // Multiply number by 1 or 2
        sum += (incNum > 9) ? incNum - 9 : incNum;  // Sum the digits up and add to total
    }
    return (sum % 10 === 0);
}
export function check_errors(formValues) {
    let temp_errors = {}
    Object.keys(formValues).forEach((key)=>{
        let value = formValues[key]
        switch(key) {
            case '_id':
                (!onlyNumbers.test(value) || !is_id_valid_by_algorithm(value)) ?  temp_errors._id_error = error_default_messages._id_error : temp_errors._id_error = null
                break;
            case 'email':
                !validEmailRegex.test(value) ? temp_errors.email_error = error_default_messages.email_error : temp_errors.email_error = null;
                break;
            case 'password':
                    (value.length < 8) ? temp_errors.password_error = error_default_messages.password_error : temp_errors.password_error = null
                    break;
            case 'first_name':
                (value.length < 2 || !onlyEnglishAndHebrew.test(value)) ? temp_errors.first_name_error = error_default_messages.first_name_error :temp_errors.first_name_error = null
                break;
            case 'last_name':
                    (value.length < 2 || !onlyEnglishAndHebrew.test(value)) ? temp_errors.last_name_error = error_default_messages.last_name_error : temp_errors.last_name_error = null;
                    break;
            case 'study_year':
                    (!value) ?  temp_errors.year_error = error_default_messages.year_error :  temp_errors.year_error = null 
                    break;
            case 'tel_number':
                    (value.length !== 10 || !onlyNumbers.test(value)) ? temp_errors.tel_number_error = error_default_messages.tel_number_error :  temp_errors.tel_number_error = null
                    break;
            case 'gender':
                    (value !== 'male' && value!=='female') ? temp_errors.gender_error = error_default_messages.gender_error :  temp_errors.gender_error = null
                    break;

            default:
            break;
        }
    })
    return temp_errors
}
