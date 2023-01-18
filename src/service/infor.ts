import { Infor, InforResponse } from './../models/infor.model';
import { GroupChatId } from "@open-wa/wa-automate";
import axios from "axios";
require("dotenv").config();
const BASEURL_BOTINFORS = process.env.BASEURL_BOTINFORS;


export async function getInfor(
  id: GroupChatId
): Promise<InforResponse> {
  return axios
    .get<Infor>(`${BASEURL_BOTINFORS}/infors/${id}`)
    .then((res) => {
      return {
        status: true,
        infor: res.data,
        error: 0,
      };
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return {
        status: false,
        infor: null,
        error: err?.response?.status || 123,
      };
    });
}

export async function updateInfor(
  id: GroupChatId,
  text: string
): Promise<boolean> {
  console.log(`id: ${id}, text: ${text}`);
  
  return axios
    .patch<Infor>(`${BASEURL_BOTINFORS}/infors/${id}`, {
      text: text,
    })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(`error updateInfor: ${err}`);
      return false;
    });
}

export async function createInfor(
  id: GroupChatId,
  text: string
): Promise<boolean> {
  return axios
    .post<Infor>(`${BASEURL_BOTINFORS}/infors`, {
      id: id,
      text: text,
    })
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return false;
    });
}

export async function deleteInfor(
  id: GroupChatId
): Promise<boolean> {
  return axios
    .delete<Infor>(`${BASEURL_BOTINFORS}/infors/${id}`)
    .then((res) => {
      return true;
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return false;
    });
}