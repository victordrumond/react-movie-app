export module Builder {

    export function getListName(listNameCamelCase: string): string | undefined {
        if (listNameCamelCase === 'favorites') return 'Favorites';
        if (listNameCamelCase === 'watchList' || listNameCamelCase === 'watchlist') return 'Watch List';
        if (listNameCamelCase === 'watching') return 'Watching';
        if (listNameCamelCase === 'watched') return 'Watched';
        return;
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

    export function isItemOnList(userData: MovieApp.UserData, movieId: number, list: string): boolean {
        const isMovieSaved = userData.movies.findIndex(item => item.data.id === movieId);
        if (isMovieSaved > -1) {
          const isMovieOnList = userData.movies[isMovieSaved].lists.findIndex(e => e.list === list);
          return isMovieOnList > -1;
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
