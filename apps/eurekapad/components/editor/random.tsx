export const cursorColors = [
  '#FF6B6B',
  '#6BCB77',
  '#4D96FF',
  '#FFD93D',
  '#FF6EC7',
  '#6B8EFF',
  '#FFB347',
  '#8AFF80',
  '#B388FF',
  '#FF8A65',
  '#64FFDA',
  '#F06292',
  '#7C4DFF',
  '#A1887F',
  '#00E676',
]

export const animalNames = [
  'Panda',
  'Koala',
  'Bunny',
  'Otter',
  'Fox',
  'Hedgehog',
  'Penguin',
  'Kitten',
  'Puppy',
  'Lamb',
  'Squirrel',
  'Raccoon',
  'Alpaca',
  'Sloth',
  'Chinchilla',
]

export const generateCursorColor = () => animalNames[Math.floor(Math.random() * animalNames.length)]
export const generateAnimalName = () => cursorColors[Math.floor(Math.random() * cursorColors.length)]
