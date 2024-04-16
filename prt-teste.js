const snmp = require("net-snmp");

const oids = [
  "1.3.6.1.4.1.367.3.2.1.2.19.1.0",
  "1.3.6.1.4.1.367.3.2.1.2.1.4.0",
];

const Printers =
  "prt00-almox prt00-com prt00-contabilidade prt00-dir prt00-dp prt01-dp prt00-fin prt00-geocamp prt00-itilh prt00-lic prt00-npd prt00-onl prt00-programacao prt00-publica prt00-suporte prt01-fin prt01-onl prt00-rh prt00-cgr prt00-jur";
const Impressoras = Printers.split(" ").map(
  (printer) => printer + ".el.com.br"
);

function consultarImpressoras(Impressoras, callback) {
  const resultados = [];
  let consultasConcluidas = 0;

  Impressoras.forEach((printer) => {
    const session = snmp.createSession(printer, "public");

    session.get(oids, (error, varbinds) => {
      consultasConcluidas++;

      if (error) {
        console.error(`Erro ao obter dados da impressora ${printer}: ${error}`);
      } else {
        const valorPaginas = varbinds[0].value.toString();
        const valorSerie = varbinds[1].value.toString();
        resultados.push({ printer, valorPaginas, valorSerie });
      }

      session.close();

      if (consultasConcluidas === Impressoras.length) {
        callback(resultados);
      }
    });
  });
}


// Iniciando as consultas SNMP
consultarImpressoras(Impressoras, (resultados) => {
  console.log("Resultados obtidos:", resultados);
});
