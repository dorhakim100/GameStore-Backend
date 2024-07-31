import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'gameDB'
const PAGE_SIZE = 6

// localStorage.clear()

if (!localStorage.getItem(STORAGE_KEY)) {
  const demoData = createDemoData()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData))
  // console.log(demoData)
}

export const gameService = {
  query,
  getById,
  save,
  remove,
  getEmptygame,
  getRandomgame,
  getDefaultFilter,
  getMaxPage,
  getRandomGames,
}

function query(filterBy = {}, isAll) {
  return storageService.query(STORAGE_KEY).then((games) => {
    const regExp = new RegExp(filterBy.txt, 'i')
    if (filterBy.txt) {
      games = games.filter((game) => regExp.test(game.name))
      console.log(games)
    } else {
      filterBy.txt = ''
    }
    if (filterBy.maxPrice) {
      games = games.filter((game) => game.price <= filterBy.maxPrice)
    } else {
      filterBy.maxPrice = ''
    }
    if (filterBy.inStock === 'onlyInStock') {
      games = games.filter((game) => game.inStock === true)
    } else {
      filterBy.inStock = 'all'
    }
    if (filterBy.companies.length > 0) {
      games = games.filter((game) =>
        filterBy.companies.every((company) => game.companies.includes(company))
      )
    } else {
      filterBy.companies = []
    }
    if (filterBy.labels.length > 0) {
      games = games.filter((game) =>
        filterBy.labels.every((company) => game.labels.includes(company))
      )
    } else {
      filterBy.labels = []
    }
    if (filterBy.sortBy) {
      let sortDirection
      let type
      if (filterBy.sortBy === 'NameDescending') {
        sortDirection = 1
        type = 'name'
      } else if (filterBy.sortBy === 'NameAscending') {
        sortDirection = -1
        type = 'name'
      } else if (filterBy.sortBy === 'PriceDescending') {
        sortDirection = -1
        type = 'price'
      } else if (filterBy.sortBy === 'PriceAscending') {
        sortDirection = 1
        type = 'price'
      } else if (filterBy.sortBy === 'TimeDescending') {
        sortDirection = -1
        type = 'createdAt'
      } else if (filterBy.sortBy === 'TimeAscending') {
        sortDirection = 1
        type = 'createdAt'
      }
      games.sort((game1, game2) => {
        if (type === 'name') {
          return game1.name.localeCompare(game2.name) * sortDirection
        } else if (type === 'price' || type === 'createdAt') {
          return (game1[type] - game2[type]) * sortDirection
        }
      })
    } else {
      filterBy.sortBy = ''
    }
    if (filterBy.pageIdx === null) {
      return games
    } else {
      if (isAll) return games
      const startIdx = filterBy.pageIdx * PAGE_SIZE
      games = games.slice(startIdx, startIdx + PAGE_SIZE)
      return games
    }
    return games
  })
}

function getById(gameId) {
  return storageService.get(STORAGE_KEY, gameId)
}

function remove(gameId) {
  // return Promise.reject('Not now!')
  return storageService.remove(STORAGE_KEY, gameId)
}

function save(game) {
  if (game._id) {
    return storageService.put(STORAGE_KEY, game)
  } else {
    // when switching to backend - remove the next line
    game.owner = userService.getLoggedinUser()
    return storageService.post(STORAGE_KEY, game)
  }
}

function getEmptygame() {
  return {
    vendor: '',
    price: '',
  }
}

function getRandomgame() {
  return {
    vendor: 'Susita-' + (Date.now() % 1000),
    price: utilService.getRandomIntInclusive(1000, 9000),
  }
}

function getDefaultFilter() {
  return {
    txt: '',
    maxPrice: '',
    labels: [],
    inStock: 'all',
    companies: [],
    sortBy: '',
    pageIdx: 0,
  }
}

function getMaxPage(filterBy) {
  // const gamesLength = JSON.parse(localStorage.getItem(STORAGE_KEY)).length
  return query(filterBy, true).then((games) => {
    const gamesLength = games.length
    const maxPage = Math.ceil(gamesLength / PAGE_SIZE)
    return maxPage
  })
}

function getRandomGames() {
  const randomGames = []
  return query(getDefaultFilter(), true).then((games) => {
    for (let i = 0; i < 12; i++) {
      const currIdx = utilService.getRandomIntInclusive(0, 35)
      randomGames.push(games[currIdx])
    }
    return randomGames
  })
}

// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 6', price: 980}).then(x => console.log(x))

function createDemoData() {
  const games = [
    {
      _id: 't101',
      name: 'Pokemon Gold',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1631031801011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://m.media-amazon.com/images/I/61X24yubIHL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Embark on a classic RPG adventure to become the ultimate Pokémon Master in the Johto region.',
    },
    {
      _id: 't102',
      name: 'The Legend of Zelda: Breath of the Wild',
      price: 60,
      labels: ['Action', 'Adventure'],
      createdAt: 1631132802011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://m.media-amazon.com/images/I/81KGsbq8ekL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Explore the vast open world of Hyrule in this critically acclaimed action-adventure game.',
    },
    {
      _id: 't103',
      name: 'Super Mario Odyssey',
      price: 50,
      labels: ['Platformer', 'Adventure'],
      createdAt: 1631233803011,
      inStock: false,
      companies: ['Nintendo'],
      cover: 'https://m.media-amazon.com/images/I/91SF0Tzmv4L.jpg',
      preview:
        "Join Mario on a globe-trotting adventure to rescue Princess Peach from Bowser's wedding plans.",
    },
    {
      _id: 't104',
      name: "Pokemon Let's Go Pikachu",
      price: 30,
      labels: ['Adventure', 'RPG'],
      createdAt: 1631334804011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://m.media-amazon.com/images/I/71w18E60zzL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Experience a delightful reimagining of Pokémon Yellow with Pikachu as your partner.',
    },
    {
      _id: 't105',
      name: 'Fortnite',
      price: 0,
      labels: ['Battle Royale', 'Shooter'],
      createdAt: 1631435805011,
      inStock: true,
      companies: ['Microsoft', 'Sony', 'Nintendo'],
      cover:
        'https://m.media-amazon.com/images/M/MV5BNzU2YTY2OTgtZGZjZi00MTAyLThlYjUtMWM5ZmYzOGEyOWJhXkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_FMjpg_UX1000_.jpg',
      preview:
        'Jump into the action-packed battle royale phenomenon where only one can emerge victorious.',
    },
    {
      _id: 't106',
      name: 'Call of Duty: Modern Warfare REMASTERED',
      price: 60,
      labels: ['Shooter', 'Action'],
      createdAt: 1631536806011,
      inStock: false,
      companies: ['Microsoft', 'Sony'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/d/d4/Call_of_Duty_-_Modern_Warfare_Remastered.jpeg',
      preview:
        'Relive the iconic first-person shooter experience with enhanced graphics and gameplay.',
    },
    {
      _id: 't107',
      name: 'Animal Crossing: New Horizons',
      price: 50,
      labels: ['Simulation', 'Social'],
      createdAt: 1631637807011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcSC-Jwca7M-Svlw1C49HwQsNa5QscJqSrcw&s',
      preview:
        'Create your dream island paradise and make friends with charming animal villagers.',
    },
    {
      _id: 't108',
      name: 'Among Us',
      price: 5,
      labels: ['Party', 'Social Deduction'],
      createdAt: 1631738808011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/9/9a/Among_Us_cover_art.jpg',
      preview:
        'Uncover the impostor among your crew in this popular social deduction game.',
    },
    {
      _id: 't109',
      name: 'Hades',
      price: 25,
      labels: ['Roguelike', 'Action'],
      createdAt: 1631839809011,
      inStock: false,
      companies: ['Nintendo', 'Sony', 'Microsoft'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/c/cc/Hades_cover_art.jpg',
      preview:
        'Battle through the underworld in this critically acclaimed roguelike dungeon crawler.',
    },
    {
      _id: 't110',
      name: 'Cyberpunk 2077',
      price: 60,
      labels: ['RPG', 'Action'],
      createdAt: 1631940810011,
      inStock: true,
      companies: ['Sony', 'Microsoft'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg',
      preview:
        'Immerse yourself in a dystopian future in this ambitious open-world RPG.',
    },
    {
      _id: 't111',
      name: 'Spider-Man: Miles Morales',
      price: 50,
      labels: ['Action', 'Adventure'],
      createdAt: 1632041811011,
      inStock: true,
      companies: ['Sony'],
      cover:
        'https://image.api.playstation.com/vulcan/ap/rnd/202008/1020/PRfYtTZQsuj3ALrBXGL8MjAH.jpg',
      preview:
        'Swing into action as Miles Morales in this thrilling Spider-Man adventure.',
    },
    {
      _id: 't112',
      name: 'Halo Infinite',
      price: 60,
      labels: ['Shooter', 'Action'],
      createdAt: 1632142812011,
      inStock: true,
      companies: ['Microsoft'],
      cover: 'https://upload.wikimedia.org/wikipedia/en/1/14/Halo_Infinite.png',
      preview:
        'Join Master Chief on his latest journey in this epic first-person shooter.',
    },
    {
      _id: 't113',
      name: 'The Last of Us Part II REMASTERED',
      price: 60,
      labels: ['Action', 'Adventure'],
      createdAt: 1632243813011,
      inStock: false,
      companies: ['Sony'],
      cover:
        'https://m.media-amazon.com/images/I/818m9WGY0lL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Experience the emotional and intense continuation of Ellie’s journey in a post-apocalyptic world.',
    },
    {
      _id: 't114',
      name: 'Ghost of Tsushima',
      price: 60,
      labels: ['Action', 'Adventure'],
      createdAt: 1632344814011,
      inStock: true,
      companies: ['Sony'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/b/b6/Ghost_of_Tsushima.jpg',
      preview:
        'Become a legendary samurai in this stunning open-world adventure set in feudal Japan.',
    },
    {
      _id: 't115',
      name: 'Gears 5',
      price: 50,
      labels: ['Shooter', 'Action'],
      createdAt: 1632445815011,
      inStock: true,
      companies: ['Microsoft'],
      cover:
        'https://store-images.s-microsoft.com/image/apps.10933.65494054591008504.4eae27ba-1cfe-4af2-950a-4af81f8cd22a.b5b2909d-8884-48d0-b25a-68d6518c9b73',
      preview:
        'Dive into intense cover-based shooting action in the latest installment of the Gears series.',
    },
    {
      _id: 't116',
      name: 'Super Smash Bros. Ultimate',
      price: 60,
      labels: ['Fighting', 'Party'],
      createdAt: 1632546816011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://m.media-amazon.com/images/I/81aJ-R4E6gL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Battle it out with your favorite Nintendo characters in the ultimate crossover fighting game.',
    },
    {
      _id: 't117',
      name: 'Mario Kart 8 Deluxe',
      price: 60,
      labels: ['Racing', 'Party'],
      createdAt: 1632647817011,
      inStock: false,
      companies: ['Nintendo'],
      cover:
        'https://m.media-amazon.com/images/I/51uY0eZg+IS._SY445_SX342_.jpg',
      preview:
        'Race against friends and foes in this fun and chaotic kart racing.',
    },
    {
      _id: 't118',
      name: 'Pokemon Silver',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1632748818011,
      inStock: true,
      companies: ['Nintendo'],
      cover: 'https://m.media-amazon.com/images/I/81UQlso+frL.jpg',
      preview:
        'Explore the Johto region and become the ultimate Pokémon Master.',
    },
    {
      _id: 't119',
      name: 'Pokemon Ruby',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1632849819011,
      inStock: false,
      companies: ['Nintendo'],
      cover:
        'https://archives.bulbagarden.net/media/upload/5/5f/Ruby_EN_boxart.png',
      preview:
        'Embark on a journey to become the champion of the Hoenn region.',
    },
    {
      _id: 't120',
      name: 'Pokemon Sapphire',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1632950820011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://upload.wikimedia.org/wikibooks/en/0/02/Pokemon_Sapphire.jpg',
      preview:
        'Set out on an adventure in the Hoenn region to catch and train Pokémon.',
    },
    {
      _id: 't121',
      name: 'Pokemon FireRed',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1633051821011,
      inStock: false,
      companies: ['Nintendo'],
      cover:
        'https://cdn.mobygames.com/covers/4278328-pokemon-firered-version-game-boy-advance-front-cover.jpg',
      preview:
        'Relive the original Pokémon adventure with enhanced graphics and features.',
    },
    {
      _id: 't122',
      name: 'Pokemon LeafGreen',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1633152822011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/a/a7/Pokemon_LeafGreen_box.jpg',
      preview:
        'Return to the Kanto region and catch them all in this enhanced remake.',
    },
    {
      _id: 't123',
      name: 'Pokemon Diamond',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1633253823011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://m.media-amazon.com/images/I/51YYsveKmrL._AC_UF1000,1000_QL80_.jpg',
      preview: 'Travel to the Sinnoh region and become a Pokémon Champion.',
    },
    {
      _id: 't124',
      name: 'Pokemon Pearl',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1633354824011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://m.media-amazon.com/images/I/51oJC-CcGeL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Embark on a new adventure in the Sinnoh region with enhanced features.',
    },
    {
      _id: 't125',
      name: 'Pokemon Platinum',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1633455825011,
      inStock: false,
      companies: ['Nintendo'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/c/ca/Pokemon_Platinum.png',
      preview:
        'Discover new areas and Pokémon in this enhanced version of Diamond and Pearl.',
    },
    {
      _id: 't126',
      name: 'Pokemon Black',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1633556826011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/e/e1/Pokemon_Black_Box_Artwork.jpg',
      preview:
        'Explore the Unova region and uncover its mysteries in this thrilling Pokémon adventure.',
    },
    {
      _id: 't127',
      name: 'Pokemon White',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1633657827011,
      inStock: true,
      companies: ['Nintendo'],
      cover: 'https://m.media-amazon.com/images/I/81ZhVKZo2+L.jpg',
      preview:
        'Set out on a new journey in the Unova region with new Pokémon to catch.',
    },
    {
      _id: 't128',
      name: 'Pokemon Black 2',
      price: 123,
      labels: ['Adventure', 'RPG'],
      createdAt: 1633758828011,
      inStock: false,
      companies: ['Nintendo'],
      cover: 'https://m.media-amazon.com/images/I/81r7F73-nQL.jpg',
      preview:
        'Return to the Unova region in this exciting sequel with new features and challenges.',
    },
    {
      _id: 't129',
      name: 'Spider-Man: Remastered',
      price: 50,
      labels: ['Action', 'Adventure'],
      createdAt: 1633859829011,
      inStock: true,
      companies: ['Sony'],
      cover:
        'https://image.api.playstation.com/vulcan/ap/rnd/202009/3021/BtsjAgHT9pqHRXtN9FCk7xc8.png',
      preview:
        'Experience the award-winning Spider-Man game with enhanced graphics and features.',
    },
    {
      _id: 't130',
      name: 'Spider-Man: Miles Morales Ultimate Edition',
      price: 70,
      labels: ['Action', 'Adventure'],
      createdAt: 1633960830011,
      inStock: true,
      companies: ['Sony'],
      cover:
        'https://m.media-amazon.com/images/I/81k2F67bOfL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Get the ultimate Spider-Man experience with the base game and additional content.',
    },
    {
      _id: 't131',
      name: 'The Legend of Zelda: Tears of the Kingdom',
      price: 70,
      labels: ['Action', 'Adventure'],
      createdAt: 1634061831011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/f/fb/The_Legend_of_Zelda_Tears_of_the_Kingdom_cover.jpg',
      preview:
        'Embark on an epic journey in the highly anticipated sequel to Breath of the Wild.',
    },
    {
      _id: 't132',
      name: 'Elden Ring',
      price: 60,
      labels: ['RPG', 'Action'],
      createdAt: 1634162832011,
      inStock: true,
      companies: ['Sony', 'Microsoft'],
      cover: 'https://vgs.co.il/wp-content/uploads/2022/02/ELDEN-RING-PS5.jpg',
      preview:
        'Explore a vast open world and uncover the mysteries of the Elden Ring in this dark fantasy RPG.',
    },
    {
      _id: 't133',
      name: 'Hogwarts Legacy',
      price: 70,
      labels: ['RPG', 'Adventure'],
      createdAt: 1634263833011,
      inStock: true,
      companies: ['Sony', 'Microsoft'],
      cover:
        'https://m.media-amazon.com/images/I/51t9mmzJdlL._AC_UF894,1000_QL80_.jpg',
      preview:
        'Experience the wizarding world like never before in this open-world RPG set in Hogwarts.',
    },
    {
      _id: 't134',
      name: 'Resident Evil Village',
      price: 60,
      labels: ['Horror', 'Action'],
      createdAt: 1634364834011,
      inStock: false,
      companies: ['Sony', 'Microsoft'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/Resident_Evil_Village.png/220px-Resident_Evil_Village.png',
      preview:
        'Survive the horrors of a remote village in this thrilling installment of the Resident Evil series.',
    },
    {
      _id: 't135',
      name: 'Ratchet & Clank: Rift Apart',
      price: 70,
      labels: ['Action', 'Adventure'],
      createdAt: 1634465835011,
      inStock: false,
      companies: ['Sony'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/a/a3/Ratchet_%26_Clank_-_Rift_Apart.png',
      preview:
        'Jump between dimensions and save the multiverse in this action-packed adventure.',
    },
    {
      _id: 't136',
      name: 'Forza Horizon 5',
      price: 60,
      labels: ['Racing', 'Simulation'],
      createdAt: 1634566836011,
      inStock: true,
      companies: ['Microsoft'],
      cover:
        'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6466/6466929_sd.jpg;maxHeight=640;maxWidth=550',
      preview:
        'Race across stunning landscapes in this open-world racing game.',
    },
    {
      _id: 't137',
      name: 'Halo Infinite',
      price: 60,
      labels: ['Shooter', 'Action'],
      createdAt: 1634667837011,
      inStock: true,
      companies: ['Microsoft'],
      cover:
        'https://m.media-amazon.com/images/I/81r6IF9GNNL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Join Master Chief on his latest journey in this epic first-person shooter.',
    },
    {
      _id: 't138',
      name: 'Metroid Dread',
      price: 60,
      labels: ['Action', 'Adventure'],
      createdAt: 1634768838011,
      inStock: true,
      companies: ['Nintendo'],
      cover:
        'https://m.media-amazon.com/images/I/71T6eyChIdL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Help Samus Aran evade the relentless E.M.M.I. robots in this thrilling action-adventure game.',
    },
    {
      _id: 't139',
      name: 'Far Cry 6',
      price: 60,
      labels: ['Shooter', 'Action'],
      createdAt: 1634869839011,
      inStock: true,
      companies: ['Sony', 'Microsoft'],
      cover:
        'https://m.media-amazon.com/images/I/81IN5D3yJUL._AC_UF1000,1000_QL80_.jpg',
      preview:
        'Liberate the tropical island of Yara from a brutal dictatorship in this open-world shooter.',
    },
    {
      _id: 't140',
      name: 'Psychonauts 2',
      price: 60,
      labels: ['Platformer', 'Adventure'],
      createdAt: 1634970840011,
      inStock: true,
      companies: ['Sony', 'Microsoft'],
      cover:
        'https://upload.wikimedia.org/wikipedia/en/2/23/Psychonauts_2_cover.png',
      preview:
        'Dive into the minds of others and uncover hidden secrets in this imaginative platformer.',
    },
  ]
  return games
}
