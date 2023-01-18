import addAuthorization from "./modules/addAuthorization"
// import addUserInGroup from "./modules/addUserInGroup"
import adminList from "./modules/adminList"
import allOptions from "./modules/allOptions"
import banUser from "./modules/banUser"
import callEveryone from "./modules/callEveryone"
import cpfQuery from "./modules/cpfQuery"
import currency from "./modules/currecy"
import deleteAuthorization from "./modules/deleteAuthorization"
import deleteMessage from "./modules/deleteMessage"
import getCep from "./modules/getCep"
import getCredits from "./modules/getCredits"
import getTemp from "./modules/getTemp"
import leave from "./modules/leave"
import lowerToUser from "./modules/lowerToUser"
import myNumber from "./modules/myNumber"
import nameQuery from "./modules/nameQuery"
import phoneQuery from "./modules/phoneQuery"
import promoteToAdmin from "./modules/promoteToAdmin"
import readme from "./modules/readme"
import setCredits from "./modules/setCredits"
import sticker from "./modules/sticker"
import textToSpeech from "./modules/textToSpeech"
import warnEveryone from "./modules/warnEveryone"
import ytDownload from "./modules/ytDownload"
import getInfo from "./modules/getInfo"
import setInfo from "./modules/setInfo"

const commands: Commands = {
  // add: addUserInGroup,
  adminlista: adminList,
  apagar: deleteMessage,
  autorizarbot: addAuthorization,
  desautorizarbot: deleteAuthorization,
  avisartodos: warnEveryone,
  mencionartodos: callEveryone,
  ban: banUser,
  cep: getCep,
  clima: getTemp,
  cpf: cpfQuery,
  nome: nameQuery,
  telefone: phoneQuery,
  celular: phoneQuery,
  numero: phoneQuery,
  creditos: getCredits,
  addcreditos: setCredits,
  menu: allOptions,
  help: allOptions,
  readme: readme,
  meunumero: myNumber,
  moeda: currency,
  promover: promoteToAdmin,
  rebaixar: lowerToUser,
  s: sticker,
  t: sticker,
  sticker: sticker,
  fig: sticker,
  sair: leave,
  tts: textToSpeech,
  yt: ytDownload,
  info: getInfo,
  setinfo: setInfo
}

interface Commands {
  [key: string]: Function
}

export default commands