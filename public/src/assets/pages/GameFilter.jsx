import { useEffect, useState, useRef } from 'react'

import { setFilterBy } from '../../store/actions/game.actions.js'
import { utilService } from '../../services/util.service.js'
import { setIsLoadingTrue } from '../../store/actions/game.actions.js'

import { Button, Autocomplete, TextField } from '@mui/material'
import { styled, alpha } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputBase from '@mui/material/InputBase'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'

import '../css/GameFilter.css'

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

export function GameFilter({ filterBy }) {
  const labels = [
    'Adventure',
    'RPG',
    'Action',
    'Platformer',
    'Sandbox',
    'Survival',
    'Shooter',
    'Battle Royale',
    'Simulation',
    'Social',
    'Party',
    'Social Deduction',
    'Roguelike',
    'Fighting',
    'Racing',
  ]
  const companies = ['Sony', 'Nintendo', 'Microsoft']
  const [isFiltering, setIsFiltering] = useState(false)
  const [isStock, setIsStock] = useState(false)

  const [onFilterBy, setOnFilterBy] = useState(filterBy)
  const debouncedSetFilter = useRef(utilService.debounce(setOnFilterBy, 500))

  //   const isCheckRef = useRef()

  useEffect(() => {
    setFilterBy(onFilterBy)
  }, [onFilterBy])

  function onSetIsFiltering() {
    setIsFiltering((prevIsFiltering) => (prevIsFiltering = !prevIsFiltering))
  }

  function onIsSetStock() {
    const currentOnlyIsStock = !isStock
    if (currentOnlyIsStock) {
      setOnFilterBy({ ...onFilterBy, inStock: 'onlyInStock', pageIdx: 0 })
    } else {
      setOnFilterBy({ ...onFilterBy, inStock: 'all', pageIdx: 0 })
    }
    setIsStock(currentOnlyIsStock)
  }

  function handleChange({ target }) {
    setIsLoadingTrue()
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
        // setOnFilterBy({ ...onFilterBy, maxPrice: value, pageIdx: 0 })

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

  function onClearFilter() {
    setOnFilterBy({
      ...onFilterBy,
      txt: '',
      maxPrice: '',
      labels: [],
      inStock: 'all',
      companies: [],
    })
  }

  return (
    <div className='filtering-container'>
      <Button
        variant='contained'
        className='is-filtering-button'
        onClick={() => onSetIsFiltering()}
      >
        Filter
      </Button>
      <input
        className='is-filtering-checkbox'
        type='checkbox'
        name=''
        id='filter'
        checked={isFiltering}
        // ref={isCheckRef}
      />
      <Search onChange={handleChange} id='name' name='txt'>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder='Search...'
          inputProps={{ 'aria-label': 'search' }}
        />
      </Search>

      <div className='game-filter'>
        <button className='x-button' onClick={() => onSetIsFiltering()}>
          X
        </button>
        <button onClick={onClearFilter}>Clear Filter</button>
        <div className='text-container'>
          {/* <label htmlFor='name'>Game Title:</label> */}
          <Search onChange={handleChange} id='name' name='txt'>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder='Search...'
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
        </div>
        <div className='price-container'>
          <label htmlFor='price'>Max Price</label>
          <input
            onChange={handleChange}
            type='range'
            id='price'
            min={1}
            max={150}
            name='maxPrice'
          />
        </div>
        <div className='in-stock-container'>
          <label htmlFor='stock'>Only In Stock</label>
          <input
            onClick={() => onIsSetStock()}
            type='checkbox'
            name=''
            id='stock'
            checked={isStock}
          />
        </div>
        <h4>Company:</h4>
        <div className='companies-container'>
          {companies.map((company) => {
            return (
              <div className='transparent-checkbox company-container'>
                <label htmlFor={company}>{company}</label>
                <input
                  onChange={handleChange}
                  type='checkbox'
                  name='companies'
                  id={company}
                />
              </div>
            )
          })}
        </div>
        <h4>Categories:</h4>
        <div className='labels-container'>
          {labels.map((label) => {
            return (
              <div className='transparent-checkbox label-container'>
                <label htmlFor={label}>{label}</label>
                <input
                  onChange={handleChange}
                  type='checkbox'
                  name='labels'
                  id={label}
                />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
// return { txt: '', maxPrice: '', labels: [], inStock: 'all', company: 'all' }
