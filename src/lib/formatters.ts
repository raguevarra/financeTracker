/*
Helper functions for formatting currencies.
Automatically adds +/- signs based on the amount and formats the currency in CAD.
*/
import { Prisma } from "@prisma/client";

type FormatCurrencyOptions = {
    showSign?: boolean;
};

const cadFormatter = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
});

export function formatCurrency(
    value: number | Prisma.Decimal | string,
    options: FormatCurrencyOptions = {}
) {
    const amount = Number(value);

    const formatted = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
    }).format(Math.abs(amount));

    if (!options.showSign) {
        return cadFormatter.format(amount);
    }

    if (amount > 0) return `+${formatted}`;
    if (amount < 0) return `-${formatted}`;

    return formatted;
}