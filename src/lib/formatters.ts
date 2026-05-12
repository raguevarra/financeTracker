/*
Helper functions for formatting different values.
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

    const formatted = cadFormatter.format(Math.abs(amount));

    if (!options.showSign) {
        return cadFormatter.format(amount);
    }

    if (amount > 0) return `+${formatted}`;
    if (amount < 0) return `-${formatted}`;

    return formatted;
}

export function formatDate(
    date: Date | string
) {
    return new Date(date).toLocaleDateString("en-CA", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}