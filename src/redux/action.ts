import { Socket } from "socket.io-client";

export const SOCKET = "SOCKET";
export const PERSONALINFO = "PERSONALINFO";
export const CONTACTINFO = "CONTACTINFO";

export const setSocket = (socket: Socket) => {
   return {
      type: SOCKET,
      payload: socket,
   };
};

export const setPersonalInfoForm = (formData: Record<any, any>): Action => {
   return {
      type: PERSONALINFO,
      payload: formData,
   };
};

export const setContactInfoForm = (formData: Record<any, any>): Action => {
   return {
      type: CONTACTINFO,
      payload: formData,
   };
};
