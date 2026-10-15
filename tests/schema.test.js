
import { describe, it, expect } from "vitest";
import { usuarioSchema } from "../src/schema.js";

describe("Validação de usuários", () => {
  it("aceita dados válidos e sanitiza os campos", () => {
    const resultado = usuarioSchema.safeParse({
      nome: "  Maria Silva  ",
      email: " MARIA@EXEMPLO.COM ",
      idade: 20,
      status_assinatura: "ATIVO",
      periodo: {
        data_inicio: "2026-10-15T10:00:00Z",
        data_fim: "2026-11-15T10:00:00Z"
      }
    });

    expect(resultado.success).toBe(true);

    if (resultado.success) {
      expect(resultado.data.nome).toBe("Maria Silva");
      expect(resultado.data.email).toBe("maria@exemplo.com");
    }
  });

  it("rejeita e-mail inválido e idade menor que 18", () => {
    const resultado = usuarioSchema.safeParse({
      nome: "Ana Silva",
      email: "email-invalido",
      idade: 16,
      periodo: {
        data_inicio: "2026-10-15T10:00:00Z",
        data_fim: "2026-11-15T10:00:00Z"
      }
    });

    expect(resultado.success).toBe(false);
  });
});
