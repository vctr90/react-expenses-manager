import { setObjectToSessionStorage } from "../../helpers/general";

export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_ERROR = 'CREATE_USER_ERROR';
export const SET_APP_LOADING = 'SET_APP_LOADING';
export const USER_LOG_IN_ERROR = 'USER_LOG_IN_ERROR';
export const USER_LOG_IN_SUCCESS = 'USER_LOG_IN_SUCCESS';
export const SET_USER_LOADING = 'SET_USER_LOADING';
const baseUrl = `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`

const userCreationFail = error => ({
  type: CREATE_USER_ERROR,
  payload: error
})

const hasUserBeenCreated = user => ({
  type: CREATE_USER_SUCCESS,
  payload: user
});

const setUserLoading = isUserLoading => ({
  type: SET_USER_LOADING,
  payload: { isUserLoading }
});

const setAppLoading = isLoading => ({
  type: SET_APP_LOADING,
  payload: { isLoading: isLoading }
})

const userLoginSuccess = user => ({
  type: USER_LOG_IN_SUCCESS,
  payload: user
})

const userLoginError = error => ({
  type: USER_LOG_IN_ERROR,
  payload: error
})

const notifyUserCreation = dispatch => {
  dispatch(hasUserBeenCreated(true));
  dispatch(hasUserBeenCreated(false));
};

const CreateUser = () => (userPayload) => {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/api/user/sign-up`;
      const body = JSON.stringify({ user: userPayload });
      dispatch(setAppLoading(true));
      const rawResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
      });
      const response = await rawResponse.json()
      if (!rawResponse.ok) {
        dispatch(setAppLoading(false));
        throw response;
      }

      dispatch(setAppLoading(false));
      notifyUserCreation(dispatch);
    } catch (error) {
      dispatch(userCreationFail(error));
    }
  }
}

const setUserLocally = ({ dispatch, rawResponse, response }) => {
  //TODO: THIS OBJECT SHOULD ONLY SAVE THE EMAIL
  setObjectToSessionStorage(response);
  if (!rawResponse.ok) {
    dispatch(setAppLoading(false));
    dispatch(setUserLoading(false));
    throw response;
  }

  dispatch(userLoginSuccess(response));
  //CHECK THE NEW WAY WE ARE SETTING this, IT IS NOT WORKING PROPERLY IT IS GENERATING AN INFINITE LOOP
  dispatch(setAppLoading(false));
  dispatch(setUserLoading(false));
};

const LogIn = () => (userPayload) => {
  return async (dispatch) => {
    try {
      const url = `${baseUrl}/api/user/login`;
      const body = JSON.stringify({ user: userPayload });
      dispatch(setAppLoading(true));
      dispatch(setUserLoading(true));
      const rawResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body
      });
      const response = await rawResponse.json()

      setUserLocally({ dispatch, rawResponse, response });
    } catch (error) {
      dispatch(userLoginError(error));
    }
  }
};

const SetUser = () => () => {
  return async (dispatch) => {
    try {
      const email = sessionStorage.getItem('email');
      if (email) {
        const url = `${baseUrl}/api/user/get/${email}`;
        dispatch(setUserLoading(true));
        dispatch(setAppLoading(true));
        const rawResponse = await fetch(url, {
          credentials: 'include'
        });
        const response = await rawResponse.json()

        setUserLocally({ dispatch, rawResponse, response });
      }
    } catch (error) {
      dispatch(userLoginError(error));
    }
  };
};

export const ActionCreators = () => ({
  createUser: CreateUser(),
  logIn: LogIn(),
  setUser: SetUser()
});