import { CatalogItem } from './CatalogItem';

class Movie extends CatalogItem {
    public director: string;
    public producers: string;
    public actors: string;
    public language: string;
    public subtitles: string;
    public dubbed: string;
    public runtime: number;
    public timestamp: Date;

    constructor (
        id: string,
        title: string,
        date: string,
        director: string,
        producers: string,
        actors: string,
        language: string,
        subtitles: string,
        dubbed: string,
        runtime: number,
        timestamp?: Date) {
        super(id, title, date);
        this.director = director;
        this.producers = producers;
        this.actors = actors;
        this.language = language;
        this.subtitles = subtitles;
        this.dubbed = dubbed;
        this.runtime = runtime;
        this.timestamp = timestamp;
    }
}
export { Movie };
