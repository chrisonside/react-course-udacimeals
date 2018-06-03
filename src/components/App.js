import React, { Component } from 'react';
import { connect } from 'react-redux';
import { addRecipe, removeFromCalendar } from '../actions';
import { capitalize } from '../utils/helper';
import CalendarIcon from 'react-icons/lib/fa/calendar-plus-o';
import ArrowRightIcon from 'react-icons/lib/fa/arrow-circle-right';
import Modal from 'react-modal';
import Loading from 'react-loading';
import { fetchRecipes } from '../utils/api';
import FoodList from './FoodList';
import ShoppingList from './ShoppingList.js'
   

class App extends Component {
  // SO BEFORE mapDispatchToProps() was used, we could dispatch an action like so: 
  // doThing() = () => {
  //   this.props.dispatch(addRecipe({}))
  // }
  // WHICH WOULD HAVE WORKED FINE AS DISPATCH WAS AVAILABLE TO USE VIA CONNECT

  // BUT AFTER mapDispatchToProps(), YOU COULD WRITE: 
  // doThing() = () => {
  //   this.props.selectRecipe({})
  // }

  // Set up my local state that won't be handled by Redux
  state = {
    foodModalOpen: false,
    meal: null,
    day: null,
    food: null,
    loadingFood: false,
    ingredientsModalOpen: false,
  }
  openFoodModal = ({ meal, day }) => {
    this.setState(() => ({
      foodModalOpen: true,
      meal,
      day,
    }))
  }
  closeFoodModal = () => {
    this.setState(() => ({
      foodModalOpen: false,
      meal: null,
      day: null,
      food: null,
    }))
  }
  searchFood = (e) => {
    if (!this.input.value) {
      return
    }

    e.preventDefault()

    this.setState(() => ({ loadingFood: true }))

    fetchRecipes(this.input.value)
      .then((food) => this.setState(() => ({
        food,
        loadingFood: false,
      })))
  }

  openIngredientsModal = () => this.setState(() => ({ ingredientsModalOpen: true }));
  closeIngredientsModal = () => this.setState(() => ({ ingredientsModalOpen: false }));

  generateShoppingList = () => {
    return this.props.calendar.reduce((result, { meals }) => {
      const { breakfast, lunch, dinner } = meals
      // Push meals to a single array
      breakfast && result.push(breakfast)
      lunch && result.push(lunch)
      dinner && result.push(dinner)

      return result
    }, []) 
    // Then flatten that array
    .reduce((ings, { ingredientLines }) => ings.concat(ingredientLines), [])
  }

  render() {
    // The log here nows shows that we have dispatch, as we're exporting using connect()()
    // So if we want to be able to dispatch an action inside of a component, you need to is CONNECT THAT COMPONENT - then you can call dispatch
    // console.log('Props', this.props);

    const { foodModalOpen, loadingFood, food, ingredientsModalOpen } = this.state
    // We are getting calendar and remove from our mapStateToProps and mapDispathToProps. And selectRecipe from 
    const { calendar, selectRecipe, remove } = this.props
    const mealOrder = ['breakfast', 'lunch', 'dinner'];

    return (
      <div className='container'>

        <div className='nav'>
          <h1 className='header'>UdaciMeals</h1>
          <button
            className='shopping-list'
            onClick={this.openIngredientsModal}>
              Shopping List
          </button>
        </div>

        <ul className='meal-types'>
          {mealOrder.map((mealType) => (
            <li key={mealType} className='subheader'>
              {capitalize(mealType)}
            </li>
          ))}
        </ul>

        <div className='calendar'>
          <div className='days'>
            {calendar.map(({ day }) => <h3 key={day} className='subheader'>{capitalize(day)}</h3>)}
          </div>
          <div className='icon-grid'>
            {calendar.map(({ day, meals }) => (
              <ul key={day}>
                {mealOrder.map((meal) => (
                  <li key={meal} className='meal'>
                    {meals[meal]
                      ? <div className='food-item'>
                          <img src={meals[meal].image} alt={meals[meal].label}/>
                          <button onClick={() => remove({meal, day})}>Clear</button>
                        </div>
                      : <button onClick={() => this.openFoodModal({meal, day})} className='icon-btn'>
                          <CalendarIcon size={30}/>
                        </button>}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={foodModalOpen}
          onRequestClose={this.closeFoodModal}
          contentLabel='Modal'
        >
          <div>
            {loadingFood === true
              ? <Loading delay={200} type='spin' color='#222' className='loading' />
              : <div className='search-container'>
                  <h3 className='subheader'>
                    Find a meal for {capitalize(this.state.day)} {this.state.meal}.
                  </h3>
                  <div className='search'>
                    <input
                      className='food-input'
                      type='text'
                      placeholder='Search Foods'
                      ref={(input) => this.input = input}
                    />
                    <button
                      className='icon-btn'
                      onClick={this.searchFood}>
                        <ArrowRightIcon size={30}/>
                    </button>
                  </div>
                  {food !== null && (
                    <FoodList
                      food={food}
                      onSelect={(recipe) => {
                        selectRecipe({ recipe, day: this.state.day, meal: this.state.meal })
                        this.closeFoodModal()
                      }}
                    />)}
                </div>}
          </div>
        </Modal>

        <Modal
          className='modal'
          overlayClassName='overlay'
          isOpen={ingredientsModalOpen}
          onRequestClose={this.closeIngredientsModal}
          contentLabel='Modal'
        >
          {ingredientsModalOpen && <ShoppingList list={this.generateShoppingList()}/>}
        </Modal>

      </div>
    )
  }
}


// SO THIS FUNCTION RETURNS THE STATE THAT WE WANT FROM THE REDUX STORE TO BE PASSED INTO THIS COMPONENT
// WE ARE USING THIS FUNCTION TO REFORMAT THE SHAPE OF THE DATA FOR THE WAY WE WANT IT IN THIS COMPONENT
// I.E. USING CONNECT TO MAP THE REDUX STATE TO THE PROPS OF OUR SPECIFIC COMPONENT

// function mapStateToProps(calendar) {
function mapStateToProps( {food, calendar} ) {

  const dayOrder = ['sunday','monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // So lets shape our data into an array
  // Object.keys (not Object.prototype.keys) provides an array of Object properties (which we can then work with as an array, e.g. to reduce in our case)
  // So I'm going to return an object that has a calendar property on it...
  // And we want to reduce all of Object.keys(calendar[day]) to a single object
  return {
    calendar: dayOrder.map((day) => ({
      day,
      meals: Object.keys(calendar[day]).reduce((meals, meal) => {
        meals[meal] = calendar[day][meal] ? food[calendar[day][meal]] : null;
        return meals;
      }, {})
    }))
  }
  // WHAT WE RETURN IS GOING TO BE PASSED TO OUR COMPONENT AS PROPS
  /* So each array item will now be an object that looks like:
  
  day: monday,
  meals: {
    breakfast: null,
    lunch: null,
    dinner: null
  }

  Note that when we say Object.keys(calendar[day]) we are creating an array of object properties from:
  {
    breakfast: null,
    lunch: null,
    dinner: null
  }
  .. which we can then work with as an array, and reduce down into a single object, which will be the value for our meals property in the object we will work with in this component 
  */

}
/* MORE NOTES ON MAPSTATETOPROPS IN THIS FILE - What we are doing in this function is quite a common Redux React connundrum. 
In Redux, it makes sense to store information in an object style e.g. how we had it hard-coded initially in reducers/index.js, and the calendar property we were passing to mapStateToProps for transformation
const initialCalendarState = {
  sunday: {
    breakfast: null,
    lunch: null,
    dinner: null
  },
  monday: {
    breakfast: null,
    lunch: null,
    dinner: null
  }
But in React, especially if you want to map over data and output things in a grid, it makes sense to work with an array rather than an object. 
e.g. where for each object in the calendar array, you'd have: 
day: monday,
meals: {
  breakfast: null,
  lunch: null,
  dinner: null
}
So we use mapStateToProps to shape the state's data how this component wants it. 
*/



// WHAT WE RETURN WILL BE PASSED TO OUR COMPONENT AS PROPS
// SOME PEOPLE USE THIS METHOD TO BIND DISPATCH TO OUR ACTION CREATORS BEFORE THEY EVER HIT OUR COMPONENT
// SEE NOTES ABOVE ON HOW THIS AFFECTS (TIDIES UP) SYNTAX
function mapDispatchToProps(dispatch) {
  return {
    selectRecipe: (data) => dispatch(addRecipe(data)),
    remove: (data) => dispatch(removeFromCalendar(data))
  }
}

// Use connect to curry and return a function that takes in App
// **Using connect(), we can conveniently access the store context set by Provider. We pass in parts of the state as well as action-dispatches to the component as props.**
// export default App
export default connect(
  mapStateToProps,
  mapDispatchToProps)(App)
