import React from 'react';
import { Form,  Label, Button} from 'semantic-ui-react'; //Radio,
import '../../styles/signup-form.scss'
import '../../styles/general.scss'
import {Field}  from 'redux-form'
//all form came from here: https://rangle.io/blog/creating-forms-with-redux-part-i , https://rangle.io/blog/creating-forms-with-redux-part-ii

const textField =({label, input, placeholder, type, error, pointer, direction, disable=false, ref}) => {
    return (
        <Form.Field required>
            <label>{label}</label>
            <Form.Input  {...input} style={{direction:direction}}
                disabled = {disable}
                type={type}
                placeholder={placeholder}
                error={error}
                ref={ref}
            />
            {pointer}
        </Form.Field>
    )
}

const RadioGenerator = props => {
    if (props && props.input && props.options) {
      const renderRadioButtons = (key, index) => {
        return (
              <Form.Field key={`${index}`}>
                  <label className="sans-serif w-100" key={`${index}`} htmlFor={`${props.input.name}-${index}`}></label>
                    <Field
                    id={`${index}`}
                    component="input"
                    name={props.input.name}
                    type="radio"
                    value={key}
                    />
                    {props.options[key]}
            </Form.Field>
        )
      };
      return (
        <div className="mv3 w-100">
          <div className="b sans-serif pv2 w-100">
            {props.label}
          </div>
          <div>
            {props.options && Object.keys(props.options).map(renderRadioButtons)}
          </div>
        </div>
      );
    }
    return <div></div>
  }

  const Select = props => {
    const renderSelectOptions = (key, index) => {
      return (
        <option
          key={`${index}-${key}`}
          value={key}
        >
          {props.options[key]}
        </option>
      );
    }
  
    if (props && props.options) {
      return (
        <div className="mv3 w-100">
          <div className="b sans-serif pv2 w-100">{props.label}</div>
          <select {...props.input} className="pa2 input-reset ba b--black-40 w-100">
            <option value="">בחר שנת לימוד</option>
            {Object.keys(props.options).map(renderSelectOptions)}
          </select>
        </div>
      )
    }
    return <div></div>
  }

  const CheckboxGenerator = props => {
    return (
      <div className="flex items-center mv4 w-100">
        <input
          {...props.input}
          type="checkbox"
          checked={props.input.value}
        />
        <div className="sans-serif">{props.label}</div>
      </div>
    );
  }
export const SignupFormRedux = ({handleSubmit, onSubmit, errors, formValues, idDisabled, formSubmitButtonName, submitDisabled=false}) => {
    // useEffect(()=>{
    //   formValues = formValues
    // })
    const id_number_field = () => {
        return (
            <Field name="_id" label="ת.ז" placeholder='ת.ז - שם משתמש' type="text" error={errors._id_error} pointer={<Label size="tiny" pointing>שם המשתמש</Label>} component={textField} direction="ltr" disable={idDisabled}/>
        )
    }
    const password_field = () => {
        return (
            <Field name="password" label="סיסמה" placeholder='סיסמה' type="password" error={errors.password_error} component={textField} direction="ltr"/>
        )
    }
    const email_field = () => {
        return (
            <Field  name='email' label="email" placeholder='email' type="email" error={errors.email_error} component={textField} direction="ltr"/>
        )
    }
    const first_name_field = () => {
        return (
            <Field name='first_name' label="שם פרטי" placeholder='שם פרטי' type="text" error={errors.first_name_error} component={textField} direction="rtl"/>
        )
    }
    const last_name_field = () => {
        return (
            <Field name='last_name' label="שם משפחה" placeholder='שם משפחה' type="text" error={errors.last_name_error} component={textField} direction="rtl"/>
        )
    }
    const tel_number_field = () => {
        return (
            <Field name='tel_number' label="טלפון" placeholder='05xxxxxxxx' type="text" error={errors.tel_number_error} component={textField} direction="ltr"/>
        )
    }

    const genders_field = () => {
        return (
            <Field name="gender" label="מגדר" component={RadioGenerator} options={{male: 'זכר',   female: 'נקבה' }} />
        )
    }

    const study_year_field = () => {
        return (
            <Field
                name="study_year"
                label="שנת לימודים"
                component={Select}
                options={{ year_a: 'שנה א', year_b: 'שנה ב', year_c: 'שנה ג', year_d: 'שנה ד', year_e: 'שנה ה' }}
            />
        )
    }
    // NO NEED ANYMORE
    // const bank_details_field = () => {
    //     return (
    //         <Form.Field>
    //         <Field name='bank_account_name' label="שם החשבון" placeholder='שם החשבון' type="text" component={textField} direction="ltr"/>
    //         <Field name='bank_number' label="מס' בנק" placeholder="מס' בנק" type="text" component={textField} direction="ltr"/>
    //         <Field name='bank_branch' label='סניף' placeholder='סניף' type="text" component={textField} direction="ltr"/>
    //         <Field name='bank_account_number' label="מס' חשבון" placeholder="מס' חשבון" type="text" component={textField} direction="ltr"/>
    //         </Form.Field>
    //     )
    // }

    const roles_field = () => {
        return (
            <Form.Field>
                <Field name="isStudent" label="תלמיד" component={CheckboxGenerator}/>
                <Field name="isTeacher" label="מורה"  component={CheckboxGenerator}/>
                {/* {formValues && ('isTeacher' in formValues) && (formValues.isTeacher) && bank_details_field()} */} 
            </Form.Field>
        )
    }
    
    return (
        <Form style={{margin:"2%"}}>
            <Form.Group widths='equal'>
                {id_number_field()}
                {password_field()}
                {email_field()}
            </Form.Group>
            <Form.Group widths='equal'>
                {first_name_field()}
                {last_name_field()}
                {tel_number_field()}
            </Form.Group>
            <Form.Group  widths='equal'>
                {study_year_field()}
                {roles_field()}
                {genders_field()}
            </Form.Group>
            <Form.Group>
                <Form.Field>
                    {submitDisabled ?  <Button disabled={true} primary>פרטיך עודכנו</Button> : <Button onClick={handleSubmit(onSubmit)} primary>{formSubmitButtonName}</Button>}
                </Form.Field>
            </Form.Group>
        </Form>
    )
}


