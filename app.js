const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')
const popupDisplay = document.querySelector('.popup-container')

const wordle = 'STACEY'

const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    '←',
]

const guessRows = [
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', ''],
    ['', '', '', '', '', '']
]
let currentRow = 0
let currentTile = 0
let isGameOver = false

guessRows.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
    tileDisplay.append(rowElement)
})

keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

const handleClick = (letter) => {
    if (!isGameOver) {
        if (letter === '←') {
            deleteLetter()
            return
        }
        if (letter === 'ENTER') {
            checkRow()
            return
        }
        addLetter(letter)
    }
}

const addLetter = (letter) => {
    if (currentTile < 6 && currentRow < 6) {
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = letter
        guessRows[currentRow][currentTile] = letter
        tile.setAttribute('data', letter)
        currentTile++
    }
}

const deleteLetter = () => {
    if (currentTile > 0) {
        currentTile--
        const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
        tile.textContent = ''
        guessRows[currentRow][currentTile] = ''
        tile.setAttribute('data', '')
    }
}

const checkRow = () => {
    const guess = guessRows[currentRow].join('')

    if (currentTile > 5) {
        flipTile()
        if (wordle == guess) {
            showMessage('✅ Mensagem decodificada!')
            showOverlay()
            showPopup()
            share()
            isGameOver = true
            return
        } else {
            if (currentRow >= 5) {
                showMessage('⛔ Código Incorreto!')
                tryAgain()
                isGameOver = true
                return
            }
        }
        if (currentRow < 5) {
            currentRow++
            currentTile = 0
        }
    }
}

const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
}

function tryAgain() {
    const buttonElement = document.createElement('button')
    buttonElement.setAttribute('onclick', 'reload()')
    buttonElement.innerHTML = `Clique aqui para tentar outra vez!`
    messageDisplay.append(buttonElement)
}

//reload-button
function reload() {
    window.location.reload();
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordle = wordle
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}

// Show Overlay
const overlay = document.getElementById('overlay-container')
function showOverlay() {
    overlay.style.display = 'block'
}

// Show Popup
function showPopup() {
    const popupElement = document.createElement('img')
    popupElement.setAttribute('src', './images/animacao.gif')
    popupElement.setAttribute('id', 'image')
    popupElement.setAttribute('alt', 'Desenho de uma garota alien de pele rosa, quatro olhos pretos e antenas. Ao lado há um balão de fala com o texto: Oi eu sou a Stacey')
    popupElement.style.display = 'block'
    popupDisplay.append(popupElement)
}

function share() {
    const shareElement = document.createElement('a')
    shareElement.setAttribute('id', 'tweet')
    shareElement.setAttribute('href', `https://twitter.com/intent/tweet?text=Eu%20decodifiquei%20a%20mensagem!%20Tente%20também!%20https://games.lgbtqspacey.com%20via%20@lgbtqspacey`)
    shareElement.innerHTML = `Compartilhar no Twitter`
    messageDisplay.append(shareElement)
}
