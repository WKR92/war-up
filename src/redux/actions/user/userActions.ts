import { USER_LOGGED_IN, USER_LOGGED_OUT} from './userActionTypes';
import { User } from '../../../Models/Models';

export const userLoggedIn = (user: User) => {
  return {
    type: USER_LOGGED_IN,
    payload: {
      email: user.email,
      uid: user.uid,
      displayName: user.displayName,
      photoUrl: user.photoURL,
      role: user.email === 'kris.galinski@gmail.com' ? 'MP' : 'BG'
    }
  }
}

export const userLoggedOut = () => {
  return {
    type: USER_LOGGED_OUT,
  }
}