

export const isPastVisit = (start) => {
    const now = new Date();
    return new Date(start) < now;
}