// Import our CONSTANTS from our actions folder's index.js file
import {
  ADD_RECIPE,
  REMOVE_FROM_CALENDAR,
} from '../actions'

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
  },
  tuesday: {
    breakfast: null,
    lunch: null,
    dinner: null
  },
  wednesday: {
    breakfast: null,
    lunch: null,
    dinner: null
  },
  thursday: {
    breakfast: null,
    lunch: null,
    dinner: null
  },
  friday: {
    breakfast: null,
    lunch: null,
    dinner: null
  },
  saturday: {
    breakfast: null,
    lunch: null,
    dinner: null
  },
}


// Very first time our reducer is called, it'll be called with a state of undefined
// So in this example we then set our intial state to be the object above...
// state = initialCalendarState ......AKA if state is undefined, set it to our object above

function calendar(state = initialCalendarState, action) {
  const { day, recipe, meal } = action;

  switch (action.type) {
    
    case ADD_RECIPE : 
      return {
        // Return a copied & spread version of the old state for us to work with
        ...state,
        [day]: {
          // We don't want to modify anything except a specific meal on a specific day
          // So target this only, and we are saying (that in this new state object), state on this specific day will stay the same - but update the meal
          ...state[day],
          [meal]: recipe.label,
        }
      }

      case REMOVE_FROM_CALENDAR : 
        return {
          ...state,
          [day]: {
            ...state[day],
            [meal]: null,
          }
        }

      default : 
        return state;
  }
}

// Finally export our reducer so that it can be imported elsewhere in our project
export default calendar;