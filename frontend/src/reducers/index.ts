import { Action } from "redux";
import { actionCreatorFactory, isType } from "typescript-fsa";

export interface RootState {
  loggedIntoOura: boolean;
}

const create = actionCreatorFactory("root");

export const setOuraLoggedIn = create<boolean>("SET_OURA_LOGGED_IN");

const initialState = { pendingOuraLoginAction: false, loggedIntoOura: false };

export default (state: RootState = initialState, action: Action): RootState => {
  if (isType(action, setOuraLoggedIn)) {
    return { ...state, loggedIntoOura: action.payload };
  } else {
    return state;
  }
};
