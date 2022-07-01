import { Constants } from './Constants';

export module Helper {

    export function separateByComma(data: string[]): string[] {
        let formattedData: string[] = [];
        for (const item of data) {
            formattedData.push(item + ', ');
        }
        formattedData[formattedData.length - 1] = formattedData[formattedData.length - 1].replace(', ', '');
        return formattedData;
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

    export function validateUsername(username: string): boolean {
        let regex = /^\w+$/;
        return regex.test(username);
    }

    export function getDenormalizeName(normalizedName: string): string {
        if (!normalizedName) return '';
        return normalizedName.replaceAll('_', ' ').replace(normalizedName[0], normalizedName[0].toUpperCase());
    }

}
