import * as Mongo from "mongodb"

export default class Database {
    private static database: Mongo.Db;
    private static get uri(): string {
        const password = encodeURIComponent("Csma0012");
        return `mongodb://master:${password}@cluster0-shard-00-00-crrrc.mongodb.net:27017,cluster0-shard-00-01-crrrc.mongodb.net:27017,cluster0-shard-00-02-crrrc.mongodb.net:27017/admin?replicaSet=Cluster0-shard-0&ssl=true`;
    }

    public static async connect(): Promise<void> {
        if (Database.database == null || Database.database == undefined) {
            try {
                Database.database = await Mongo.connect(Database.uri);
            } catch (e) {
                console.log(e);
            }
        }
    }

    public static async create(document: any, collection: string): Promise<boolean> {
        let operation = this.database
        .collection(collection)
        .insert(document);
        return (await operation).insertedCount == 1;
    }

    public static async read(query: any, collection: string): Promise<any[]> {
        return await this.database
        .collection(collection)
        .find(query)
        .toArray();
    }

    public static async update(query: any, newValues: any, collection: string): Promise<boolean> {
        let operation = this.database
        .collection(collection)
        .updateOne(query, {$set: newValues})
        return (await operation).modifiedCount == 1;
    }

    public static async delete(query: any, collection: string): Promise<number> {
        let operation = this.database
        .collection(collection)
        .deleteMany(query);
        return (await operation).deletedCount as number;
    }

}