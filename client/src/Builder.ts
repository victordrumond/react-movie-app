import { Movie } from "./Movie";
import { TvShow } from "./TvShow";

export module Builder {

    export function isMovie(item: Movie | TvShow | TMDb.SearchObject): boolean {
        if (item instanceof Movie) return true;
        if (item instanceof TvShow) return false;
        if (item.media_type) return item.media_type === 'movie';
        return item.title ? true : false;
    }

    export function isListEmpty(list: any[]): boolean {
        return list.length === 0;
    }

    export function getListName(listNameCamelCase: string): string | undefined {
        if (listNameCamelCase === 'favorites') return 'Favorites';
        if (listNameCamelCase === 'watchList' || listNameCamelCase === 'watchlist') return 'Watch List';
        if (listNameCamelCase === 'watching') return 'Watching';
        if (listNameCamelCase === 'watched') return 'Watched';
        return;
    }

    export function getListsNames(): string[] {
        return ['favorites', 'watchList', 'watching', 'watched'];
    }

    export function getListSorting(listsConfig: MovieApp.ListsConfig, list: string): string | undefined {
        if (list === 'favorites' || list === 'watchList' || list === 'watching' || list === 'watched') {
            return listsConfig[list].sorting;
        }
        return;
    }

    export function getListFiltering(listsConfig: MovieApp.ListsConfig, list: string): MovieApp.Filtering | undefined {
        if (list === 'favorites' || list === 'watchList' || list === 'watching' || list === 'watched') {
            return listsConfig[list].filtering;
        }
        return;
    }

    export function getFilters(): string[] {
        return ['last_added', 'first_added', 'title', 'highest_score', 'lowest_score'];
    }

    export function isItemOnList(userData: MovieApp.UserData, id: number, type: string, list: string): boolean {
        const isItemSaved = userData.movies.findIndex(item => item.data.id === id && item.data.media_type === type);
        if (isItemSaved > -1) {
          const isItemOnList = userData.movies[isItemSaved].lists.findIndex(item => item.list === list);
          return isItemOnList > -1;
        }
        return false;
    }

    export function getItemsPerPage(width: number, layout: string): number {
        if (layout === 'list') return 10;
        if (width > 1199 || width < 768) return 10;
        return 12;
    }

    export function getListData(userData: MovieApp.UserData, list: string): MovieApp.SavedItem[] {
        let items: MovieApp.SavedItem[] = [];
        for (const item of userData.movies) {
            const isItemOnList = item.lists.findIndex(e => e.list === list);
            if (isItemOnList > -1) {
                items.push(item);
            }
        }
        return items;
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

    export function getSeasonCode(season: number): string {
        if (season < 1) return '';
        if (season < 10) return `S0${season}`;
        return `S${season}`;
    }

    export function isSeasonSelectedOnList(userData: MovieApp.UserData, showId: number, list: string, season: number): boolean {
        const showIndex = userData.movies.findIndex(item => item.data.id === showId);
        const listIndex = userData.movies[showIndex].lists.findIndex(item => item.list === list);
        const listInfo = userData.movies[showIndex].lists[listIndex];
        if (listInfo.seasons) {
            const hasSeason = listInfo.seasons.findIndex(item => item === season);
            return hasSeason > -1;
        }
        return false;
    }

}
