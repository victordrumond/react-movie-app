import Helper from './Helper';
import { TIME } from './Constants';

class Activity {

    constructor(label, data, timestamp) {
        this.label = label;
        this.data = data;
        this.timestamp = timestamp;
    }

    getLabel() {
        return this.label;
    }

    getImageUrl() {
        if (this.data.movie && this.data.image) {
            return `https://image.tmdb.org/t/p/w500${this.data.image}`;
        }
        return null;
    }

    getMovie() {
        return this.data.hasOwnProperty('movie') ? this.data.movie : null;
    }

    getList() {
        return this.data.hasOwnProperty('list') ? this.data.list : null;
    }

    hasRating() {
        return this.data.hasOwnProperty('rating');
    }

    getRating() {
        return this.data.hasOwnProperty('rating') ? this.data.rating : null;
    }

    getTimestamp() {
        return this.timestamp;
    }

    getDescription() {
        if (this.label === 'movie_added' && this.data.movie && this.data.list) {
            return `${this.data.movie} was added to ${Helper.getListName(this.data.list)}`;
        }
        if (this.label === 'movie_deleted' && this.data.movie && this.data.list) {
            return `${this.data.movie} was deleted from ${Helper.getListName(this.data.list)}`;
        }
        if (this.label === 'movie_rated' && this.data.movie && !this.data.rating) {
            return `${this.data.movie} rating has been reset`;
        }
        if (this.label === 'movie_rated' && this.data.movie && this.data.rating) {
            return `${this.data.movie} was rated with ${this.data.rating} stars`;
        }
        return '';
    }

    getTimeString() {
        let timeDifference = Date.now() - this.timestamp;
        if (timeDifference < TIME.minute) return `Seconds ago`;
        if (timeDifference < (2 * TIME.minute)) return `1 minute ago`;
        if (timeDifference < TIME.hour) return `${Math.floor(timeDifference/TIME.minute)} minutes ago`;
        if (timeDifference < (2 * TIME.hour)) return `1 hour ago`;
        if (timeDifference < TIME.day) return `${Math.floor(timeDifference/TIME.hour)} hours ago`;
        if (timeDifference < (2 * TIME.day)) return `1 day ago`;
        if (timeDifference < TIME.month) return `${Math.floor(timeDifference/TIME.day)} days ago`;
        if (timeDifference < (2 * TIME.month)) return `1 month ago`;
        if (timeDifference < TIME.year) return `${Math.floor(timeDifference/TIME.month)} months ago`;
        if (timeDifference < (2 * TIME.year)) return `1 year ago`;
        return `${Math.floor(timeDifference/TIME.year)} years ago`;
    }
    
}

export default Activity;
