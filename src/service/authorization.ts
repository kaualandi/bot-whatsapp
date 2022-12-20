import { ContactId, GroupChatId } from "@open-wa/wa-automate";
import axios from "axios";
import {
  Authorization,
  AuthorizationResponse,
} from "../models/authorization.model";
require("dotenv").config();
const BASEURL_BOTINFORS = process.env.BASEURL_BOTINFORS;


export async function authorization(
  id: ContactId | GroupChatId
): Promise<boolean> {
  const _checkAuthorization = await checkAuthorization(id);

  if (_checkAuthorization.status) {
    const authorization = _checkAuthorization.authorization;
    return authorization;
  } else {
    return false;
  }
}

export async function checkAuthorization(
  id: ContactId | GroupChatId
): Promise<AuthorizationResponse> {
  console.log(BASEURL_BOTINFORS);
  
  return axios
    .get<Authorization>(`${BASEURL_BOTINFORS}/authorizations/${id}`)
    .then((res) => {
      return {
        status: true,
        authorization: res.data.authorization,
        error: 0,
      };
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return {
        status: false,
        authorization: false,
        error: err?.response?.status || 123,
      };
    });
}

export async function updateAuthorization(
  value: boolean,
  id: string
): Promise<boolean> {
  return axios
    .patch(`${BASEURL_BOTINFORS}/authorizations/${id}`, {
      authorization: value,
    })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return false;
    });
}

export async function createAuthorization(
  value: boolean,
  id: string
): Promise<{
  status: boolean;
  error: number;
}> {
  return axios
    .post(`${BASEURL_BOTINFORS}/authorizations`, {
      id: id,
      authorization: value,
    })
    .then((res) => {
      return {
        status: true,
        error: 0,
      };
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return {
        status: false,
        error: err?.response?.status,
      };
    });
}