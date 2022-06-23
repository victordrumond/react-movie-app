import { Constants } from './Constants';

export module Helper {

    export function separateByComma(data: string[]): string[] {
        let formattedData: string[] = [];
        for (const item of data) {
            formattedData.push(item + ', ');
        }
        formattedData[formattedData.length - 1].replace(', ', '');
        return formattedData;
    }

    export function getScoreBarColor(score: string): string {
        const scoreNum = parseFloat(score);
        if (scoreNum < 4) return 'colorF';
        if (scoreNum < 6) return 'colorE';
        if (scoreNum < 7) return 'colorD';
        if (scoreNum < 8) return 'colorC';
        if (scoreNum < 9) return 'colorB';
        if (scoreNum <= 10) return 'colorA';
        return 'colorNR';
    }

    export function getNormalizedListName(listName: string): string {
        return listName.replace(' ', '').replace(listName[0], listName[0].toLowerCase());
    }

    export function getListName(normalizedListName: string): string | undefined {
        if (normalizedListName === 'favorites') return 'Favorites';
        if (normalizedListName === 'watchList') return 'Watch List';
        if (normalizedListName === 'watching') return 'Watching';
        if (normalizedListName === 'watched') return 'Watched';
        return undefined;
    }

    export function getDateString(isoDateString: string): string {
        if (isoDateString) {
            const date = new Date(isoDateString);
            return `${Constants.MONTHS[date.getMonth()]} ${date.getFullYear()}`;
        }
        return '';
    }

    export function getComparableDate(timestamp: number): number {
        let dateObj = new Date(timestamp);
        let isoDateString = dateObj.toISOString();
        return +isoDateString.substring(10, 0).replaceAll('-', '');
    }

    export function getMovieRating(id: number, userRatings: MovieApp.UserRatings[]): number {
        let isMovieRated = userRatings.findIndex(item => item.movieId === id);
        if (isMovieRated < 0) {
            return 0;
        }
        return userRatings[isMovieRated].score || 0;
    }

    export function validateUsername(username: string): boolean {
        let regex = /^\w+$/;
        return regex.test(username);
    }

}
