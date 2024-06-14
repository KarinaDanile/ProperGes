
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatToCurrency = (number, locale = 'es-ES', currency = 'EUR') => {
    const parsedNumber = typeof number === 'string' ? parseFloat(number) : number;

    return parsedNumber.toLocaleString(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
    });
}

export const formatDateString = (string) => {
    const date = new Date(string);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

export const formatDateTimeString = (string) => {
    const date = new Date(string);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
}

export const limitLines = (string, limit = 1) => {
    if (!string) return '';
    return string.split('\n').slice(0, limit).join('\n');
}