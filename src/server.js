
import express from "express";
import usuariosRouter from "./usuarios.js";

const app = express();

app.use(express.json());

app.use("/api/v1/usuarios", usuariosRouter);

// Trata JSON malformado.
app.use((err, req, res, next) => {
  if (
    err instanceof SyntaxError &&
    err.status === 400 &&
    "body" in err
  ) {
    return res.status(400).json({
      status: 400,
      message: "JSON malformado.",
      errors: {
        body: ["Verifique a sintaxe do JSON enviado."]
      }
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 500,
    message: "Erro interno do servidor."
  });
});

app.listen(3000, () => {
  console.log("Servidor em http://localhost:3000");
});
