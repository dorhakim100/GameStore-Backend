import React, { useEffect, useState } from 'react'
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from 'mdb-react-ui-kit'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

// Import the SCSS file
function linkTo(website) {
  switch (website) {
    case 'gitHub':
      window.location.href = 'https://github.com/dorhakim100'

      break

    default:
      Swal.fire({
        title: 'Come back later',
        text: `${website} account is under development`,
        icon: 'info',
      })
      break
  }
}

export function AppFooter() {
  return (
    <MDBFooter color='blue' className='font-small pt-4 mt-4 footer'>
      <div className='links-container'>
        <i
          className='fa-brands fa-facebook'
          onClick={() => linkTo('Facebook')}
        ></i>
        <i className='fa-brands fa-github' onClick={() => linkTo('gitHub')}></i>
        <i
          className='fa-brands fa-instagram'
          onClick={() => linkTo('Instagram')}
        ></i>
        <i
          className='fa-brands fa-twitter'
          onClick={() => linkTo('Twitter')}
        ></i>
      </div>
      <div className='text-center py-3'>
        <p>© 2024 Dor Hakim. All rights reserved.</p>
      </div>
    </MDBFooter>
  )
}
