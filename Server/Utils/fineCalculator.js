export const calculateFine = (dueDate) => {
    const finePerDay = 10;
    
    if (!dueDate) return 0;
    
    const today = new Date();
    const due = new Date(dueDate);
    
    today.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    
    if (today > due) {
        const daysLate = Math.floor((today - due) / (1000 * 60 * 60 * 24));
        const fine = daysLate * finePerDay;
        return fine;
    }
    
    return 0;
};