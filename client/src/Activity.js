import Helper from './Helper';
import { Constants } from './Constants';

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
        if (timeDifference < Constants.minute) return `Seconds ago`;
        if (timeDifference < (2 * Constants.minute)) return `1 minute ago`;
        if (timeDifference < Constants.hour) return `${Math.floor(timeDifference/Constants.minute)} minutes ago`;
        if (timeDifference < (2 * Constants.hour)) return `1 hour ago`;
        if (timeDifference < Constants.day) return `${Math.floor(timeDifference/Constants.hour)} hours ago`;
        if (timeDifference < (2 * Constants.day)) return `1 day ago`;
        if (timeDifference < Constants.month) return `${Math.floor(timeDifference/Constants.day)} days ago`;
        if (timeDifference < (2 * Constants.month)) return `1 month ago`;
        if (timeDifference < Constants.year) return `${Math.floor(timeDifference/Constants.month)} months ago`;
        if (timeDifference < (2 * Constants.year)) return `1 year ago`;
        return `${Math.floor(timeDifference/Constants.year)} years ago`;
    }
    
}

export default Activity;
