import { CatalogItem, InventoryItem, Book, Magazine, Movie, Music } from '../models';
import {
    BookTDG,
    InventoryTDG,
    MagazineTDG,
    MovieTDG,
    MusicTDG,
    CatalogTDG,
 } from '../persistence';

export enum CatalogItemType {
    MUSIC = 'MUSIC',
    MOVIE = 'MOVIE',
    BOOK = 'BOOK',
    MAGAZINE = 'MAGAZINE',
}

class Catalog {
    viewItems = async (query: string, order: string, direction: string, type?: CatalogItemType)
    : Promise<CatalogItem[]> => {

        let items: CatalogItem[];

        switch (type) {
        case CatalogItemType.BOOK:
            items = await BookTDG.findAll(query);
            break;
        case CatalogItemType.MUSIC:
            items = await MusicTDG.findAll(query);
            break;
        case CatalogItemType.MAGAZINE:
            items = await MagazineTDG.findAll(query);
            break;
        case CatalogItemType.MOVIE:
            items = await MovieTDG.findAll(query);
            break;
        default:
            items = [
                ...(await BookTDG.findAll(query)),
                ...(await MagazineTDG.findAll(query)),
                ...(await MovieTDG.findAll(query)),
                ...(await MusicTDG.findAll(query)),
            ];
        }

        if (order === 'title' && direction === 'asc') {
            items.sort((a, b) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0));
        }
        if (order === 'date' && direction === 'asc') {
            items.sort((a, b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
        }
        if (order === 'title' && direction === 'desc') {
            items.sort((a, b) => (a.title < b.title) ? 1 : ((b.title < a.title) ? -1 : 0));
        }
        if (order === 'date' && direction === 'desc') {
            items.sort((a, b) => (a.date < b.date) ? 1 : ((b.date < a.date) ? -1 : 0));
        }

        return items;
    }

    viewItem = async(id: string, type?: CatalogItemType) : Promise<CatalogItem> => {
        if (type) {
            switch (type) {
            case CatalogItemType.BOOK:
                return BookTDG.find(id);
            case CatalogItemType.MUSIC:
                return MusicTDG.find(id);
            case CatalogItemType.MAGAZINE:
                return MagazineTDG.find(id);
            case CatalogItemType.MOVIE:
                return MovieTDG.find(id);
            }
        } else {
            try {
                const result = await Promise.all([
                    BookTDG.find(id),
                    MagazineTDG.find(id),
                    MovieTDG.find(id),
                    MusicTDG.find(id),
                ]);

                return result.find(data => data !== null);
            } catch (error) {
                throw Error;
            }
        }
    }

    viewInventoryItems = async(
        catalogItemId?: string,
        userId?: string,
    ) : Promise<InventoryItem[]> => {
        return InventoryTDG.findAll(catalogItemId, userId);
    }

    updateItem = async (item: CatalogItem, type: CatalogItemType) : Promise<CatalogItem> => {
        switch (type) {
        case CatalogItemType.BOOK:
            await BookTDG.update(item as Book);
            break;
        case CatalogItemType.MUSIC:
            await MusicTDG.update(item as Music);
            break;
        case CatalogItemType.MAGAZINE:
            await MagazineTDG.update(item as Magazine);
            break;
        case CatalogItemType.MOVIE:
            await MovieTDG.update(item as Movie);
            break;
        }
        return item;
    }

    addItem = async (item: CatalogItem, type: CatalogItemType, quantity: number)
        : Promise<{ catalogItem: CatalogItem, inventory: InventoryItem[] }> => {
        let insertedItem: CatalogItem;
        switch (type) {
        case CatalogItemType.BOOK:
            insertedItem = await BookTDG.insert(item as Book);
            break;
        case CatalogItemType.MUSIC:
            insertedItem = await MusicTDG.insert(item as Music);
            break;
        case CatalogItemType.MAGAZINE:
            insertedItem = await MagazineTDG.insert(item as Magazine);
            break;
        case CatalogItemType.MOVIE:
            insertedItem = await MovieTDG.insert(item as Movie);
            break;
        }
        const inventoryItems = [];
        for (let i = 0; i < quantity; i += 1) {
            const inventoryItem: InventoryItem = new InventoryItem(
                null,
                insertedItem.id,
                null,
                null,
            );
            inventoryItems.push(await InventoryTDG.insert(inventoryItem));
        }

        return {
            catalogItem: insertedItem,
            inventory: inventoryItems,
        };
    }

    addInventoryItem = async (catalogItemId: string) : Promise<string> => {
        const spec = await CatalogTDG.find(catalogItemId);
        if (!spec) {
            throw new Error('Catalog item does not exist');
        }

        let inventoryItem: InventoryItem = new InventoryItem(
            null,
            catalogItemId,
            null,
            null,
        );
        inventoryItem = await InventoryTDG.insert(inventoryItem);

        return inventoryItem.id;
    }

    deleteItem = async (id: string, type: CatalogItemType): Promise<boolean> => {
        await InventoryTDG.deleteAll(id);
        switch (type.toUpperCase()) {
        case CatalogItemType.BOOK:
            await BookTDG.delete(id);
            break;
        case CatalogItemType.MOVIE:
            await MovieTDG.delete(id);
            break;
        case CatalogItemType.MUSIC:
            await MusicTDG.delete(id);
            break;
        case CatalogItemType.MAGAZINE:
            await MagazineTDG.delete(id);
            break;
        }
        return true;
    }

    deleteInventoryItem = async (catalogItemId: string) : Promise<boolean> => {
        try {
            const items = await InventoryTDG.findAll(catalogItemId);
            let item: InventoryItem;
            for (let i = 0; i < items.length; i += 1) {
                if (!items[i].loanedTo) {
                    item = items[i];
                    break;
                }
            }

            if (!item) {
                return false;
            }

            await InventoryTDG.delete(item.id);
        } catch (err) {
            console.log(err);
            return false;
        }
        return true;
    }
}

export default new Catalog();
