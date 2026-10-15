
import express from "express";
import { usuarioSchema } from "./schema.js";

const router = express.Router();
const usuarios = [];
let proximoId = 1;

router.post("/", async (req, res) => {
  const resultado = await usuarioSchema.safeParseAsync(req.body);
  const erros = {};

  if (!resultado.success) {
    for (const issue of resultado.error.issues) {
      const campo = issue.path.join(".") || "body";

      if (!erros[campo]) {
        erros[campo] = [];
      }

      erros[campo].push(issue.message);
    }
  }

  // Sanitiza o e-mail para verificar duplicidade.
  const email = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase()
    : null;

  // Só verifica duplicidade se o formato do e-mail for válido.
  const emailValido = resultado.success &&
    resultado.data.email === email;

  if (emailValido) {
    const duplicado = await verificarEmailExistente(email);

    if (duplicado) {
      erros.email ??= [];
      erros.email.push("O e-mail informado já está em uso.");
    }
  }

  if (Object.keys(erros).length > 0) {
    return res.status(422).json({
      status: 422,
      message: "Erro de validação",
      errors: erros
    });
  }

  const novoUsuario = {
    id: proximoId++,
    ...resultado.data
  };

  usuarios.push(novoUsuario);

  return res.status(201).json({
    message: "Usuário cadastrado com sucesso.",
    usuario: novoUsuario
  });
});

async function verificarEmailExistente(email) {
  return usuarios.some(usuario => usuario.email === email);
}

export default router;
