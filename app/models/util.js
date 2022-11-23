export function UtilDin(value) {
    return (value.toLocaleString('pt-br'));
}

export function utilJSON(titulo, data) {
    return JSON.parse(`{"${titulo}":[${data}]}`);
}

export function utilSelectPgto(data) {
    if (data.hasOwnProperty("card")) {
        return `"metodoPgto":"cartão", "bandeira": "${data.card.brand}", "origemCard": "${data.card.country}", "mes_exp": "${data.card.exp_month}",
           "ano_exp": "${data.card.exp_year}" , "lastNum":"${data.card.last4}", "modalidadePgto":"${data.card.funding}", "impressãoDig_pgto": "${data.card.fingerprint}"
        `
    } else {
        return `"erro":"método não configurado!"`
    }
}