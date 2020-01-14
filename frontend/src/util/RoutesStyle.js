const weights = { metro: 6, tram: 4, bus: 2, trol: 2 }
const colors = { tram: 'darkgreen', bus: 'black', trol: 'purple' }
const metro_colors = {
  2: 'red', // 1
  3: 'seagreen', // 2
  4: 'darkblue', // 3
  5: 'deepskyblue', // 4
  6: 'deepskyblue', // 4
  7: 'brown', // 5
  8: 'orange', // 6
  9: 'purple', // 7
  12: '#ddba00', // 8
  3750: '#ddba00', // 8A
  13: 'gray', // 9
  17: 'lime', // 10
  3572: 'teal', // 11
  15: 'cadetblue', // 12
  16: 'blue', // 13
  3138: 'red', // 14
  4459: 'hotpink', // 15
  4723: 'darkorange', // D1
  4728: 'deeppink' // D2
}

export function routeStyle(route) {
  return {
    color: colors[route.type] || metro_colors[route.id],
    weight: weights[route.type]
  }
}

export function toRussianType(type) {
  return {
    metro: 'Метро',
    tram: 'Трамвай',
    trol: 'Троллейбус',
    bus: 'Автобус'
  }[type]
}