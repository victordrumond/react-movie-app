export module Constants {
    
    export const TIME = {
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 12 * 30 * 24 * 60 * 60 * 1000
    };

    export const MONTHS = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    export const MAX_VISIBLE_PAGES = 3;
}
