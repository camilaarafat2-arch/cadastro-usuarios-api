
import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z.string()
    .trim()
    .min(3, "O nome deve ter no mínimo 3 caracteres.")
    .max(100, "O nome deve ter no máximo 100 caracteres."),

  email: z.string()
    .trim()
    .toLowerCase()
    .email("Informe um e-mail válido."),

  idade: z.number()
    .int("A idade deve ser um número inteiro.")
    .min(18, "Deve ser um número maior ou igual a 18."),

  status_assinatura: z.enum([
    "PENDENTE",
    "ATIVO",
    "CANCELADO"
  ]).optional(),

  periodo: z.object({
    data_inicio: z.string().datetime({
      offset: true,
      message: "Data de início inválida."
    }),

    data_fim: z.string().datetime({
      offset: true,
      message: "Data de fim inválida."
    })
  }).superRefine((periodo, ctx) => {
    if (
      Date.parse(periodo.data_fim) <=
      Date.parse(periodo.data_inicio)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["data_fim"],
        message: "A data de fim deve ser posterior à data de início."
      });
    }
  })
}).strict();
