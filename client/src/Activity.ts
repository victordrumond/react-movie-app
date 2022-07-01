import { Constants } from './Constants';
import { Builder } from './Builder';

export class Activity {

    label: string;
    data: MovieApp.ActivityData;
    timestamp: number;

    constructor(label: string, data: MovieApp.ActivityData, timestamp: number) {
        this.label = label;
        this.data = data;
        this.timestamp = timestamp;
    }

    getLabel(): string {
        return this.label;
    }

    getImageUrl(): string | null {
        if (this.data && this.data.movie && this.data.image) {
            return `https://image.tmdb.org/t/p/w500${this.data.image}`;
        }
        return null;
    }

    getMovie(): string | null {
        return this.data && this.data.movie ? this.data.movie : null;
    }

    getList(): string | null {
        return this.data && this.data.list ? this.data.list : null;
    }

    hasRating(): boolean {
        return this.data.hasOwnProperty('rating');
    }

    getRating(): number | null {
        return this.data && this.data.rating ? this.data.rating : null;
    }

    getTimestamp(): number {
        return this.timestamp;
    }

    getDescription(): string {
        if (this.label === 'movie_added' && this.data.movie && this.data.list) {
            return `${this.data.movie} was added to ${Builder.getListName(this.data.list)}`;
        }
        if (this.label === 'movie_deleted' && this.data.movie && this.data.list) {
            return `${this.data.movie} was deleted from ${Builder.getListName(this.data.list)}`;
        }
        if (this.label === 'movie_rated' && this.data.movie && !this.data.rating) {
            return `${this.data.movie} rating has been reset`;
        }
        if (this.label === 'movie_rated' && this.data.movie && this.data.rating) {
            return `${this.data.movie} was rated with ${this.data.rating} stars`;
        }
        return '';
    }

    getTimeString(): string {
        const TIME = Constants.TIME;
        const timeDifference = Date.now() - this.timestamp;
        if (timeDifference < TIME.minute) return `Seconds ago`;
        if (timeDifference < (2 * TIME.minute)) return `1 minute ago`;
        if (timeDifference < TIME.hour) return `${Math.floor(timeDifference / TIME.minute)} minutes ago`;
        if (timeDifference < (2 * TIME.hour)) return `1 hour ago`;
        if (timeDifference < TIME.day) return `${Math.floor(timeDifference / TIME.hour)} hours ago`;
        if (timeDifference < (2 * TIME.day)) return `1 day ago`;
        if (timeDifference < TIME.month) return `${Math.floor(timeDifference / TIME.day)} days ago`;
        if (timeDifference < (2 * TIME.month)) return `1 month ago`;
        if (timeDifference < TIME.year) return `${Math.floor(timeDifference / TIME.month)} months ago`;
        if (timeDifference < (2 * TIME.year)) return `1 year ago`;
        return `${Math.floor(timeDifference / TIME.year)} years ago`;
    }

}
