import { Client, Message } from "@open-wa/wa-automate";
import { alterClient, getClients, pushByCPF } from "../service/query";

function formatDate(dateUsa: string) {
  const dateArr = dateUsa.split("-");
  return `${dateArr[2]}/${dateArr[1]}/${dateArr[0]}`;
}

async function cpfQuery(client: Client, message: Message) {
  const { id, from, body, sender, isGroupMsg, chat, caption } = message;

  if (isGroupMsg) return;

  let { pushname, verifiedName } = sender;
  pushname = pushname || verifiedName;
  const commands = caption || body || "";
  const args = commands.split(" ");

  if (args.length === 1)
    return client.reply(
      from,
      "Ainda não adivinho coisas... preciso saber o CPF também!",
      id
    );

  const allClients = await getClients();
  if (allClients.error)
    return client.reply(
      from,
      `Não consegui recuperar os clientes!\n${allClients.message.text}`,
      id
    );

  const isClient = allClients.find((client: any) => client.phone === chat.id);

  if (!isClient)
    return client.reply(
      from,
      "Você não tem créditos suficientes para fazer essa operação, solicite uma recarga ou desista.",
      id
    );
  if (isClient.credits <= 0)
    return client.reply(
      from,
      "Você não tem créditos suficientes para fazer essa operação, solicite uma recarga ou desista.",
      id
    );
  let cpf = args[1].match(/\d/g) as any;
  if (!cpf) return client.reply(from, "Digite um CPF válido.", id);
  cpf = cpf.join("");
  if (cpf.length !== 11) return client.reply(from, "Digite um CPF válido.", id);

  const query = await pushByCPF(cpf);
  if (query.error)
    return client.reply(
      from,
      `Não consegui realizar a consulta!\n${query.message.text}`,
      id
    );

  const requestDownCredits = await alterClient(
    isClient.credits - 1,
    "credits",
    isClient.id
  );
  if (requestDownCredits.status == "error")
    return client.reply(
      from,
      `Não consegui reduzir seus creditos, portanto, não farei a consulta!\n${requestDownCredits?.message?.text}`,
      id
    );

  await client.react(id, "👌");

  const data = query;
  if (data.error)
    return client.reply(
      from,
      `Não consegui recuperar os dados do CPF: ${cpf}!\n${data.message}`,
      id
    );

  if (data?.header?.error) {
    return client.reply(from, data?.header?.error, id);
  }
  const result = data.result[0];
  const pessoa = result.pessoa;

  const { cadastral, contato } = pessoa;
  const { telefone, email, endereco } = contato;
  const {
    CPF,
    nomePrimeiro,
    nomeMeio,
    nomeUltimo,
    sexo,
    dataNascimento,
    statusReceitaFederal,
    dataAtualizacaoStatusReceitaFederal,
    rgNumero,
    rgOrgaoEmissor,
    rgUf,
    tituloEleitoral,
    obito,
    nacionalidade,
    menorDeIdade,
    estadoCivil,
    maeCPF,
    maeNomePrimeiro,
    maeNomeMeio,
    maeNomeUltimo,
    escolaridade,
  } = cadastral;
  const nomeCompleto = `${nomePrimeiro || ""} ${nomeMeio || ""} ${
    nomeUltimo || ""
  }`;
  const nomeCompletoMae = `${maeNomePrimeiro || ""} ${maeNomeMeio || ""} ${
    maeNomeUltimo || ""
  }`;
  let telefones;
  if (telefone.length === 0) {
    telefones = "Nenhum telefone encontrado.";
  } else if (telefone.length === 1) {
    const { ddd, numero, operadora } = telefone[0];
    telefones = `Telefone: (${ddd}) ${numero} - ${operadora}`;
  } else if (telefone.length > 1) {
    telefones = telefone
      .map(
        (telefone: any) =>
          `Telefone: (${telefone.ddd}) ${telefone.numero} ${
            telefone.operadora ? "- " + telefone.operadora : ""
          }`
      )
      .join("\n");
  }

  let emails;
  if (email.length === 0) {
    emails = "Nenhum email encontrado.";
  } else if (email.length === 1) {
    emails = `Email: ${email[0].email}`;
  } else if (email.length > 1) {
    emails = email.map((email: any) => `Email: ${email.email}`).join("\n");
  }

  let enderecos;
  if (endereco.length === 0) {
    enderecos = "Nenhum endereço encontrado.";
  } else if (endereco.length === 1) {
    const {
      tipoLogradouro,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
      cep,
      ordem,
    } = endereco[0];
    enderecos = `Endereço: ${tipoLogradouro} ${logradouro}, ${numero} ${complemento} - ${bairro} - ${cidade} - ${uf} - ${cep}`;
  } else if (endereco.length > 1) {
    enderecos = endereco
      .map(
        (endereco: any) =>
          `Endereço: ${endereco.tipoLogradouro} ${endereco.logradouro}, ${endereco.numero} ${endereco.complemento} - ${endereco.bairro} - ${endereco.cidade} - ${endereco.uf} - ${endereco.cep}`
      )
      .join("\n");
  }

  const stringToSend = `
*=== 🔍 CONSULTA REALIZADA 🔍 ===*
*👱 CADASTRAL*
${CPF ? "CPF: " + CPF : ""} ${nomeCompleto ? "\nNome: " + nomeCompleto : ""} ${
    sexo ? "\nSexo: " + sexo : ""
  } ${
    dataNascimento ? "\nData de nascimento: " + formatDate(dataNascimento) : ""
  } ${
    statusReceitaFederal
      ? `\nStatus da receita federal: ${statusReceitaFederal} (${
          formatDate(dataAtualizacaoStatusReceitaFederal) || ""
        })`
      : ""
  } ${rgNumero ? "\nRG: " + rgNumero : ""} ${
    rgOrgaoEmissor ? "\nOrgão emissor: " + rgOrgaoEmissor : ""
  } ${rgUf ? "\nUF: " + rgUf : ""} ${
    tituloEleitoral ? "\nTítulo de eleitor: " + tituloEleitoral : ""
  } ${
    obito == "0"
      ? "\nÓbito: Não"
      : obito == "1"
      ? "\nÓbito: Sim"
      : `\nÓbito: ${obito}`
  } ${nacionalidade ? "\nNacionalidade: " + nacionalidade : ""}
  ${estadoCivil ? "\nEstado civil: " + estadoCivil : ""} ${
    maeCPF ? "\nCPF da Mãe: " + maeCPF : ""
  } ${nomeCompletoMae !== "  " ? "\nNome da Mãe: " + nomeCompletoMae : ""} ${
    escolaridade ? "\nEscolaridade: " + escolaridade : ""
  }

*📞 TELEFONES*\n${telefones}

*📍 ENDEREÇOS*\n${enderecos}

*✉ EMAILS*\n${emails}

Consultado por: ${pushname}`;

  await client.reply(from, stringToSend, id);

  if (isGroupMsg) return;

  const { vinculo, patrimonio, socioDemografico } = pessoa;

  const { parentesco, conjuge, vizinho, houseHold, empregador } = vinculo;
  let parentescos;
  if (parentesco.length === 0) {
    parentescos = "Nenhum parente encontrado.";
  } else if (parentesco.length === 1) {
    parentescos = `Parente: ${parentesco[0].nomeCompleto || ""} - ${
      parentesco[0].cpf || ""
    } (${parentesco[0].grauDeParentesco || ""})`;
  } else if (parentesco.length > 1) {
    parentescos = parentesco
      .map(
        (parentesco: any) =>
          `Parente: ${parentesco.nomeCompleto || ""} - ${
            parentesco.cpf || ""
          } (${parentesco.grauDeParentesco || ""})`
      )
      .join("\n");
  }
  let conjuges;
  if (
    conjuge.nomePrimeiro === null &&
    conjuge.nomeMeio === null &&
    conjuge.nomeUltimo === null &&
    conjuge.parentesco === null
  ) {
    conjuges = "Nenhum conjuge encontrado.";
  } else {
    conjuges = `Conjuge: ${conjuge.nomePrimeiro || ""} ${
      conjuge.nomeMeio || ""
    } ${conjuge.nomeUltimo || ""} - ${conjuge.parentesco || ""}`;
  }
  let vizinhos;
  if (vizinho.length === 0) {
    vizinhos = "Nenhum vizinho encontrado.";
  } else if (vizinho.length === 1) {
    vizinhos = `Vizinho: ${vizinho[0].nomePrimeiro || ""} ${
      vizinho[0].nomeMeio || ""
    } ${vizinho[0].nomeUltimo || ""} - ${vizinho[0].cpf || ""} (${
      vizinho[0].nomeParentesco || ""
    })`;
  } else if (vizinho.length > 1) {
    vizinhos = vizinho
      .map(
        (vizinho: any) =>
          `Vizinho: ${vizinho.nomePrimeiro || ""} ${vizinho.nomeMeio || ""} ${
            vizinho.nomeUltimo || ""
          } - ${vizinho.cpf || ""} (${vizinho.nomeParentesco || ""})`
      )
      .join("\n");
  }
  let houseHolds;
  if (houseHold.length === 0) {
    houseHolds = "Ninguém da família encontrado.";
  } else if (houseHold.length === 1) {
    houseHolds = houseHold
      .map(
        (houseHold: any) =>
          `Família: ${houseHold.nomePrimeiro || ""} ${
            houseHold.nomeMeio || ""
          } ${houseHold.nomeUltimo || ""} - ${houseHold.cpf || ""} (${
            houseHold.nomeParentesco || ""
          })`
      )
      .join("\n");
  } else if (houseHold.length > 1) {
    houseHolds = houseHold
      .map(
        (houseHold: any) =>
          `Família: ${houseHold.nomePrimeiro || ""} ${
            houseHold.nomeMeio || ""
          } ${houseHold.nomeUltimo || ""} - ${houseHold.cpf || ""} (${
            houseHold.nomeParentesco || ""
          })`
      )
      .join("\n");
  }
  let empregos;
  if (empregador.length === 0) {
    empregos = "Nenhum empregador encontrado.";
  } else if (empregador.length === 1) {
    empregos = `Empregador: ${empregador[0].cnpj || ""} - ${
      empregador[0].razaoSocial || ""
    } (${formatDate(empregador[0].dataAdmissao) || ""})`;
  } else if (empregador.length > 1) {
    empregos = empregador
      .map(
        (empregador: any) =>
          `Empregador: ${empregador.cnpj || ""} - ${
            empregador.razaoSocial || ""
          } (${formatDate(empregador.dataAdmissao) || ""})`
      )
      .join("\n");
  }

  const { veiculo, imovel } = patrimonio;
  let veiculos;
  if (veiculo.length === 0) {
    veiculos = "Nenhum veículo encontrado.";
  } else {
    veiculos = JSON.stringify(veiculo);
  }
  let imoveis;
  if (imovel.length === 0) {
    imoveis = "Nenhum imóvel encontrado.";
  } else {
    imoveis = JSON.stringify(imovel);
  }

  const { profissao, rendaPresumida } = socioDemografico;

  const stringToSend2 = `
*=== 🔍 CONSULTA REALIZADA 🔍 ===*
*👥 PARENTES*
${parentescos}

*💏 CONJUGE*
${conjuges}

*🏘 VIZINHOS*
${vizinhos}

*👨‍👩‍👧‍👦 FAMÍLIA*
${houseHolds}

*👷 EMPREGADORES*
${empregos}

*🤑 PATRIMÔNIO*
Veículos: ${veiculos}
Imóveis: ${imoveis}

*💰 SOCIO DEMOGRAFICO*
Profissão: ${profissao || "Nenhuma profissão encontrada."}
Renda Presumida: ${rendaPresumida || "Nenhuma renda encontrada."}

Consultado por: ${pushname}`;

  await client.reply(from, stringToSend2, id);
}

export default cpfQuery;
