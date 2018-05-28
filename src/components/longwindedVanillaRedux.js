// This was the vanilla redux complex way of achieving things, before React-Redux was installed to take care of things

import React, { Component } from 'react'
import { addRecipe } from '../actions'

class App extends Component {
  // So looks like we are setting a default state, until this component mounts and then a change in the store is detected
  state = {
    calendar: null
  }
  componentDidMount () {
    const { store } = this.props
    // Now subscribe to any changes that might happen in our app's store
    // When changes do happen, grab the state from the store and update it into our local component state
    // That will cause a re-render, which will render monday's breakfast between the pre tags down below
    store.subscribe(() => {
      this.setState(() => ({
        calendar: store.getState()
      }))
    })
  }
  // Whenever our submitFood action runs the store dispatches an action, which then goes to our reducer and updates the store
  submitFood = () => {
    this.props.store.dispatch(addRecipe({
      day: 'monday',
      meal: 'breakfast',
      recipe: {
        label: this.input.value
      },
    }))

    this.input.value = ''
  }
  // The ref attribute is a special attribute provided by React that allows you to access the DOM.
  // I am rendering an uncontrolled input form here...
  render() {
    return (
      <div>
        <input
          type='text'
          ref={(input) => this.input = input}
          placeholder="Monday's Breakfast"
        />
        <button onClick={this.submitFood}>Submit</button>

        <pre>
          Monday's Breakfast: {this.state.calendar && this.state.calendar.monday.breakfast}
        </pre>
      </div>
    )
  }
}

export default App