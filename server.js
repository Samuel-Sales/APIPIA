const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();

// Aumentar o limite de tamanho do payload para 15MB (ou o tamanho que você desejar)
app.use(bodyParser.json({ limit: "15mb" }));

app.use(cors());

// Conecta ao banco de dados SQLite
const db = new sqlite3.Database("./apartamentos.db");

app.get("/apartamentos", (req, res) => {
  db.all("SELECT * FROM apartamentos", (err, rows) => {
    if (err) {
      console.error("Erro ao consultar apartamentos:", err);
      res.status(500).send("Erro interno do servidor");
      return;
    }
    res.json(rows);
  });
});

app.get("/apartamentos/:id", (req, res) => {
  const apartamentoId = req.params.id;

  // Aqui você deve implementar a lógica para buscar o apartamento pelo ID no banco de dados
  // e retornar o resultado como JSON

  // Exemplo simplificado:
  db.get(
    "SELECT * FROM apartamentos WHERE id = ?",
    [apartamentoId],
    (err, row) => {
      if (err) {
        console.error("Erro ao buscar apartamento:", err);
        res.status(500).send("Erro interno do servidor");
        return;
      }
      if (!row) {
        // Se nenhum apartamento for encontrado com o ID fornecido, retornar uma resposta 404
        res.status(404).send("Apartamento não encontrado");
        return;
      }
      // Se o apartamento for encontrado, retorná-lo como JSON
      res.json(row);
    }
  );
});

app.post("/apartamentos", (req, res) => {
  const novoApartamento = req.body;

  // Converter o array de fotos em formato JSON antes de inserir no banco de dados
  novoApartamento.fotos = JSON.stringify(novoApartamento.fotos);

  db.run(
    "INSERT INTO apartamentos (nome, preco, regiao, tamanho, endereco, quartos, banheiros, contato, fotos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      novoApartamento.nome,
      novoApartamento.preco,
      novoApartamento.regiao,
      novoApartamento.tamanho,
      novoApartamento.endereco,
      novoApartamento.quartos,
      novoApartamento.banheiros,
      novoApartamento.contato,
      novoApartamento.fotos,
    ],
    function (err) {
      if (err) {
        console.error("Erro ao inserir novo apartamento:", err);
        res.status(500).send("Erro interno do servidor");
        return;
      }
      novoApartamento.id = this.lastID;

      // Converter a string JSON de volta para um array antes de enviar a resposta
      novoApartamento.fotos = JSON.parse(novoApartamento.fotos);

      res.status(201).json(novoApartamento);
    }
  );
});

app.delete("/apartamentos/:id", (req, res) => {
  const apartamentoId = req.params.id;

  // Verificar se o ID do apartamento é um número válido
  if (isNaN(apartamentoId)) {
    return res.status(400).send("ID do apartamento inválido");
  }

  db.run(
    "DELETE FROM apartamentos WHERE id = ?",
    [apartamentoId],
    function (err) {
      if (err) {
        console.error("Erro ao excluir apartamento:", err);
        return res.status(500).send("Erro interno do servidor");
      }

      if (this.changes === 0) {
        // Se nenhum apartamento foi excluído (ID não encontrado), enviar uma resposta 404
        return res.status(404).send("Apartamento não encontrado");
      }

      res.status(200).send("Apartamento excluído com sucesso");
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
