
export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const formatToCurrency = (number, locale = 'es-ES', currency = 'EUR') => {
    const float = parseFloat(number.replace(',', '.'));
    const int = Math.round(float * 100) / 100;
    return int.toLocaleString(locale, {
        style: 'currency',
        currency: currency
    });
}

export const formatDateString = (string) => {
    const date = new Date(string);
    return date.toLocaleDateString();
}

export const limitLines = (string, limit = 1) => {
    if (!string) return '';
    return string.split('\n').slice(0, limit).join('\n');
}