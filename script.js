const message = document.querySelector('.message')
const showResult = document.querySelector('.show-result')
const digitButtons = document.querySelectorAll('.nine, .eight, .seven, .six, .five, .four, .three, .two, .one, .zero')
const operatorButtons = document.querySelectorAll('.button-plus, .button-minus, .button-multiplication, .button-division')
const clearButton = document.querySelector('.clear')
const calculateButton = document.querySelector('.calculate')
const commaButton = document.querySelector('.comma')
const procentButton = document.querySelector('.procent')
const historyButton = document.querySelector('.history-button')
const historyList = document.querySelector('.history-list')
const historyClose = document.querySelector('.history-close')
const historyEntries = document.querySelector('.history-entries')

let firstNumber = ''
let secondNumber = ''
let operator = ''
let isProcent = false

digitButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (operator === '') {
            if (firstNumber.length > 7) return
            firstNumber += button.textContent
            updateMessage(firstNumber)
        } else {
            if (secondNumber.length > 7) return
            secondNumber += button.textContent
            updateMessage(firstNumber + operator + secondNumber)
        }
    })
})

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (firstNumber === '') return
        operator = button.textContent
        updateMessage(firstNumber + operator)
    })
})

commaButton.addEventListener('click', () => {
    if (operator === '') {
        if (firstNumber.includes(',')) return
        if (firstNumber === '') firstNumber = '0'
        firstNumber += ','
        updateMessage(firstNumber)
    } else {
        if (secondNumber.includes(',')) return
        if (secondNumber === '') secondNumber = '0'
        secondNumber += ','
        updateMessage(firstNumber + operator + secondNumber)
    }
})

procentButton.addEventListener('click', () => {
    if (firstNumber === '' || secondNumber === '' || operator === '') return
    isProcent = true
    updateMessage(firstNumber + operator + secondNumber + '%')
})

clearButton.addEventListener('click', () => {
    firstNumber = ''
    secondNumber = ''
    operator = ''
    isProcent = false
    showResult.textContent = ''
    updateMessage('0')
})

calculateButton.addEventListener('click', () => {
    if (firstNumber === '' || secondNumber === '' || operator === '') return

    if (operator === '÷' && secondNumber === '0') {
        updateMessage('Error')
        return
    }

    const a = parseFloat(firstNumber.replace(',', '.'))
    let b = parseFloat(secondNumber.replace(',', '.'))

    const expression = firstNumber + operator + secondNumber + (isProcent ? '%' : '')

    if (isProcent) {
        if (operator === '+' || operator === '-') {
            b = a * (b / 100)
        } else {
            b = b / 100
        }
    }

    let result

    if (operator === '+') {
        result = a + b
    } else if (operator === '-') {
        result = a - b
    } else if (operator === '×') {
        result = a * b
    } else if (operator === '÷') {
        result = a / b
    }

    result = Math.round(result * 1e8) / 1e8

    showResult.textContent = expression
    firstNumber = result.toString()
    updateMessage(firstNumber)
    addToHistory(expression, result)
    secondNumber = ''
    operator = ''
    isProcent = false
})

let history = []

function addToHistory(expression, result) {
    history.unshift(`${expression} = ${result}`)
    if (history.length >= 5) {
        history.pop()
    }
    renderHistory()
}

function renderHistory() {
    historyEntries.innerHTML = ''
    history.forEach(entry => {
        const item = document.createElement('div')
        item.classList.add('history-entry')
        item.textContent = entry
        historyEntries.appendChild(item)
    })
}

historyButton.addEventListener('click', () => {
    historyList.style.display = historyList.style.display === 'block' ? 'none' : 'block'
})

historyClose.addEventListener('click', () => {
    historyList.style.display = 'none'
})

function updateMessage(text) {
    text = text.toString()
    message.textContent = text
    message.style.fontSize = text.length > 8 ? '26px' : '44px'
}
