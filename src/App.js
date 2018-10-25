import React, { Component } from 'react'

class App extends Component {
  resetState = () => ({
    cards: [],
    numberSelected: null,
    selectedPosition: null,
    points: 0
  })

  state = this.resetState()

  componentDidMount() {
    this.setCards()
  }

  setCards = () => {
    const cards1 = [...new Array(6)]
    const cards2 = [...new Array(6)]
    cards1.map((e, i) => this.fillArray(cards1, i))
    cards2.map((e, i) => this.fillArray(cards2, i))
    const cards = cards1.concat(cards2)
    cards.sort(() => Math.random() - 0.5)
    this.setState({ ...this.resetState(), cards })
  }

  fillArray = (array, i) => {
    const number = this.getRandomNumber()
    if (array.find(e => (e ? e['number'] === number : false)))
      this.fillArray(array, i)
    else array[i] = { number, status: false }
  }

  getRandomNumber = () => Math.floor(Math.random() * 6 + 1)

  handleCard = (number, position) => {
    // const { selectedPosition, numberSelected } = this.state
    let timeout = false
    this.setState(
      ({ cards, numberSelected, points, selectedPosition }) => {
        if (!numberSelected) {
          return { numberSelected: number, selectedPosition: position }
        } else {
          if (number === numberSelected && selectedPosition !== position) {
            const cardsCopy = [...cards]
            cardsCopy[selectedPosition] = {
              ...cardsCopy[selectedPosition],
              status: true
            }
            cardsCopy[position] = { ...cardsCopy[position], status: true }
            return {
              cards: cardsCopy,
              selected: null,
              selectedPosition: null,
              numberSelected: null,
              points: points + 1
            }
          } else {
            timeout = true
            return {
              selectedPosition: position,
              numberSelected: null
            }
          }
        }
      },
      () =>
        timeout &&
        setTimeout(() => {
          this.setState({ selectedPosition: null })
        }, 200)
    )
  }

  render() {
    const { cards, selectedPosition, points } = this.state
    const didFinish = points === cards.length / 2
    return (
      <div className="container">
        {didFinish && (
          <div className="congratulations">
            <div className="congratulations__box" />
            <button onClick={this.setCards} className="congratulations__button">
              Play again!
            </button>
          </div>
        )}
        <div className="memorama">
          {cards
            ? cards.map(({ number, status }, i) => (
                <div
                  className={`memorama__card ${
                    status ? 'active' : 'inactive'
                  } ${selectedPosition === i ? 'selected' : ''}`}
                  key={i}
                  onClick={() =>
                    !status && selectedPosition !== i
                      ? this.handleCard(number, i)
                      : alert(`Don't know how to play? Choose another card`)
                  }
                >
                  {selectedPosition === i || status ? number : ''}
                </div>
              ))
            : 'Loading cards'}
          <div className="memorama__credits">
            <span>@bernagl</span>
          </div>
        </div>
      </div>
    )
  }
}

export default App
