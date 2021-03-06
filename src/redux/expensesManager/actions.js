export const ADD_OUTCOME = 'ADD_OUTCOME';
export const ADD_INCOME = 'ADD_INCOME';
export const CATEGORY_CHANGE = 'CATEGORY_CHANGE'

const AddExpense = () => expense => ({
  type: ADD_OUTCOME, payload: expense
});

const AddIncome = () => income => ({
  type: ADD_INCOME,
  payload: income
});

const CategoryChange = () => categoryValue => ({
  type: CATEGORY_CHANGE,
  payload: categoryValue
})

export const ActionCreators = () => ({
  addExpense: AddExpense(),
  addIncome: AddIncome(),
  categoryChange: CategoryChange()
});