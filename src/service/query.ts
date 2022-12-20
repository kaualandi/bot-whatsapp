import axios from "axios";
require("dotenv").config();
const BASEURL_BOTINFORS = process.env.BASEURL_BOTINFORS;
const TOKEN_CONSULTAS = process.env.TOKEN_CONSULTAS;
const BASE_URL_CONSULTAS = process.env.BASE_URL_CONSULTAS;

export async function getClients() {
  return axios
    .get(`${BASEURL_BOTINFORS}/clients`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return {
        status: "error",
        message: {
          code: err.response?.status || err,
          text: err.response?.statusText || "",
        },
      };
    });
}

export async function alterClient(value: any, key: string, id: string) {
  return axios
    .patch(`${BASEURL_BOTINFORS}/clients/${id}`, {
      [key]: value,
    })
    .then((res) => {
      return {
        status: "success",
        message: {
          code: 200,
          text: "Alterado com sucesso",
        },
      };
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return {
        status: "error",
        message: {
          code: err.response?.status || err,
          text: err.response?.statusText || "",
        },
      };
    });
}

export async function addClient(credits: number, id: string) {
  return axios
    .post(`${BASEURL_BOTINFORS}/clients/`, {
      credits: credits,
      phone: id,
    })
    .then((res) => {
      return {
        status: "success",
        message: {
          code: 200,
          text: "Criado com sucesso",
        },
      };
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return {
        status: "error",
        message: {
          code: err.response?.status || err,
          text: err.response?.statusText || "",
        },
      };
    });
}

export async function pushByCPF(cpf: string) {
  return await axios
    .post(`${BASE_URL_CONSULTAS}/api/PF/CPF`, [cpf], {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN_CONSULTAS}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return {
        status: "error",
        message: {
          code: err.response?.status || err,
          text: err.response?.statusText || "",
        },
      };
    });
}

export async function pushByName(name: string) {
  return await axios
    .post(`${BASE_URL_CONSULTAS}/api/PF/NOME`, [name], {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN_CONSULTAS}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return {
        status: "error",
        message: {
          code: err.response?.status || err,
          text: err.response?.statusText || "",
        },
      };
    });
}

export async function pushByPhone(phone: string) {
  return await axios
    .post(`${BASE_URL_CONSULTAS}/api/PF/TELEFONE`, [phone], {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${TOKEN_CONSULTAS}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(`error: ${err}`);
      return {
        status: "error",
        message: {
          code: err.response?.status || err,
          text: err.response?.statusText || "",
        },
      };
    });
}
