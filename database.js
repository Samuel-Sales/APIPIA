const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho para o arquivo do banco de dados SQLite
const dbPath = path.resolve(__dirname, "apartamentos.db");

// Inicializa o banco de dados SQLite
const db = new sqlite3.Database(dbPath);

// Cria a tabela de apartamentos e insere os dados iniciais
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS apartamentos (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, preco REAL, regiao TEXT, tamanho REAL, endereco TEXT, quartos INTEGER, banheiros INTEGER, contato TEXT, fotos TEXT)"
  );

  // Insere os apartamentos iniciais
  const apartamentosIniciais = require("./apartamentos.json");
  const stmt = db.prepare(
    "INSERT INTO apartamentos (nome, preco, regiao, tamanho, endereco, quartos, banheiros, contato, fotos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  );
  apartamentosIniciais.forEach((apartamento) => {
    stmt.run(
      apartamento.nome,
      apartamento.preco,
      apartamento.regiao,
      apartamento.tamanho,
      apartamento.endereco,
      apartamento.quartos,
      apartamento.banheiros,
      apartamento.contato,
      JSON.stringify(apartamento.fotos)
    );
  });
  stmt.finalize();

  console.log("Banco de dados inicializado com sucesso.");
});

// Fecha a conexão com o banco de dados ao encerrar o script
process.on("exit", () => {
  db.close();
  console.log("Conexão com o banco de dados fechada.");
});
