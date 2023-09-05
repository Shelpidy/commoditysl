import { Socket } from "socket.io-client";
import { CONTACTINFO, PERSONALINFO, SOCKET } from "./action";

interface State {
   socket: Socket | null;
   personalInfo?: Record<any, any>;
   contactInfo?: Record<any, any>;
}

const initialState: State = {
   socket: null,
   personalInfo: {},
   contactInfo: {},
};

export const rootReducer = (state = initialState, action: Action): State => {
   switch (action.type) {
      case CONTACTINFO:
         return {
            ...state,
            contactInfo: { ...state.contactInfo, ...action.payload },
         };
      case PERSONALINFO:
         return {
            ...state,
            personalInfo: { ...state.personalInfo, ...action.payload },
         };
      case SOCKET:
         console.log("Reducer setting socket");
         return {
            ...state,
            socket: action.payload,
         };
      default:
         return state;
   }
};
