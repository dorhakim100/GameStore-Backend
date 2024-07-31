import * as React from 'react'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'

import { useState, useRef, useEffect } from 'react'
import { utilService } from '../../services/util.service.js'
import { useSelector } from 'react-redux'
import { setFilterBy } from '../../store/actions/game.actions.js'

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}))

export function SearchBar({ icon, navigate, toggleNavBar }) {
  const filterBy = useSelector(
    (storeSelector) => storeSelector.gameModule.filterBy
  )
  const [onFilterBy, setOnFilterBy] = useState(filterBy)
  const debouncedSetFilter = useRef(utilService.debounce(setOnFilterBy, 500))
  useEffect(() => {
    setFilterBy(onFilterBy)
  }, [onFilterBy])
  function handleChange({ target }) {
    let field = target.name
    let value = target.value
    let checkedButton = target.id

    if (!field) {
      field = 'txt'
    }

    switch (target.type) {
      case 'number':
      case 'range':
        value = +value || ''
        break

      case 'checkbox':
        if (field === 'companies') {
          if (filterBy.companies.includes(checkedButton)) {
            const idx = onFilterBy.companies.findIndex(
              (company) => company === checkedButton
            )
            onFilterBy.companies.splice(idx, 1)
          } else {
            onFilterBy.companies.push(checkedButton)
          }
          setOnFilterBy({ ...onFilterBy, pageIdx: 0 })
        }
        if (field === 'labels') {
          if (filterBy.labels.includes(checkedButton)) {
            const idx = onFilterBy.labels.findIndex(
              (label) => label === checkedButton
            )
            onFilterBy.labels.splice(idx, 1)
          } else {
            onFilterBy.labels.push(checkedButton)
          }
          setOnFilterBy({ ...onFilterBy, pageIdx: 0 })
        }
        return
        break

      default:
        break
    }

    debouncedSetFilter.current((prevFilter) => ({
      ...prevFilter,
      [field]: value,
      pageIdx: 0,
    }))
  }

  function onEnter(ev) {
    if (ev.code === 'Enter') {
      navigate('/game')
    }
  }
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='open drawer'
            sx={{ mr: 2 }}
            onClick={toggleNavBar}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            noWrap
            component='div'
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            <div className='logo-container' onClick={() => navigate('/')}>
              <h1>Game Store</h1>
              <img className='icon' src={icon} alt='' />
            </div>
          </Typography>
          <Search
            onChange={handleChange}
            id='name'
            name='txt'
            onKeyDown={(event) => onEnter(event)}
          >
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Search…'
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
