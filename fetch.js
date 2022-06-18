const axios = require("axios");
require('dotenv').config();

const BASEURL_BOTINFORS = process.env.BASEURL_BOTINFORS;
const TOKEN_CONSULTAS = process.env.TOKEN_CONSULTAS;
const BASE_URL_CONSULTAS = process.env.BASE_URL_CONSULTAS;

exports.alterAuthorization = async function alterAuthorization(value, id) {
    return axios.patch(`${BASEURL_BOTINFORS}/authorizations/${id}`, {
        authorization: value
    }).then((res) => {
        return {
            status: "success"
        }
    }
    ).catch((err) => {
        console.log(`error: ${err}`);
        return {
            status: "error",
            message: {
                code: err.response?.status || err,
                text: err.response?.statusText || ''
            }
        }
    });
}

exports.checkAuthorization = async function checkAuthorization(id) {
    return axios.get(`${BASEURL_BOTINFORS}/authorizations/${id}`).then((res) => {
        const { authorization } = res.data;
        return {
            status: "success",
            authorization: authorization
        }
    }
    ).catch((err) => {
        console.log(`error: ${err}`);
        return {
            status: "error",
            message: {
                code: err.response?.status || err,
                text: err.response?.statusText || ''
            }
        }
    });
}

exports.createAuthorization = async function createAuthorization(value, id) {
    return axios.post(`${BASEURL_BOTINFORS}/authorizations/`, {
        id: id,
        authorization: value
    }).then((res) => {
        return {
            status: "success"
        }
    }
    ).catch((err) => {
        console.log(`error: ${err}`);
        return {
            status: "error",
            message: {
                code: err.response?.status || err,
                text: err.response?.statusText || ''
            }
        }
    });
}

exports.getClients = async function getClients() {
    return axios.get(`${BASEURL_BOTINFORS}/clients`).then((res) => {
        return res.data
    }
    ).catch((err) => {
        console.log(`error: ${err}`);
        return {
            status: "error",
            message: {
                code: err.response?.status || err,
                text: err.response?.statusText || ''
            }
        }
    });
}

exports.alterClient = async function alterClient(value, key, id) {
    return axios.patch(`${BASEURL_BOTINFORS}/clients/${id}`, {
        [key]: value
    }).then((res) => {
        return {
            status: "success"
        }
    }
    ).catch((err) => {
        console.log(`error: ${err}`);
        return {
            status: "error",
            message: {
                code: err.response?.status || err,
                text: err.response?.statusText || ''
            }
        }
    });
}

exports.pushByCPF = async function pushByCPF(cpf) {
    return await axios.post(`${BASE_URL_CONSULTAS}/api/PF/CPF`, [cpf], {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${TOKEN_CONSULTAS}`
        }
    }).then((res) => {
        return res.data
    }).catch((err) => {
        console.log(`error: ${err}`);
        return {
            status: "error",
            message: {
                code: err.response?.status || err,
                text: err.response?.statusText || ''
            }
        }
    });
}
exports.pushByName = async function pushByName(name) {
    return await axios.post(`${BASE_URL_CONSULTAS}/api/PF/NOME`, [name], {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${TOKEN_CONSULTAS}`
        }
    }).then((res) => {
        return res.data
    }).catch((err) => {
        console.log(`error: ${err}`);
        return {
            status: "error",
            message: {
                code: err.response?.status || err,
                text: err.response?.statusText || ''
            }
        }
    });
}
exports.pushByPhone = async function pushByPhone(phone) {
    return await axios.post(`${BASE_URL_CONSULTAS}/api/PF/TELEFONE`, [phone], {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${TOKEN_CONSULTAS}`
        }
    }).then((res) => {
        return res.data
    }).catch((err) => {
        console.log(`error: ${err}`);
        return {
            status: "error",
            message: {
                code: err.response?.status || err,
                text: err.response?.statusText || ''
            }
        }
    });
}
