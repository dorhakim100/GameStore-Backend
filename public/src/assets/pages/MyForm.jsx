import React from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'

// import '../css/LoginSignun.css'

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  fullname: Yup.string().min(2, 'Too Short!').required('Required'),
})

export function MyForm({ handleSubmit, isSignup, handleChange }) {
  return (
    <div>
      <Formik
        initialValues={{
          username: '',
          password: '',
          fullname: '',
        }}
        validationSchema={SignupSchema}
        onSubmit={(values) => {
          // same shape as initial values
          // console.log(ev)
          // handleSubmit()
          console.log(values)
        }}
      >
        {({ errors, touched }) => (
          <Form className='login-form' onSubmit={handleSubmit}>
            <Field name='username' placeholder='Username' />
            {errors.username && touched.username ? (
              <div>{errors.username}</div>
            ) : null}
            <Field name='password' type='password' placeholder='Password' />
            {errors.password && touched.password ? (
              <div>{errors.password}</div>
            ) : null}
            {isSignup && <Field name='fullname' placeholder='Full Name' />}
            {errors.fullname && touched.fullname ? (
              <div>{errors.password}</div>
            ) : null}
            <button type='submit'>{isSignup ? 'Signup' : 'Login'}</button>
          </Form>
        )}
      </Formik>
    </div>
  )
}
