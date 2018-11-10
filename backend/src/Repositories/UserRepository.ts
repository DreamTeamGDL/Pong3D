import Database from "./Database";
import User from "../Models/User";
import {pathToFileURL} from "url";

export default class UserRepository {

    public constructor() {
        Database.connect();
    }

    public async createUser(user: string) {
        let payload: User = {
            username: user,
            playedGames: []
        };
        let values = await Database.read({username: user}, "users");
        if (values.length > 0) throw new Error("Conflict");
        await Database.create(payload, "users");
    }

    public async getUser(user: string): Promise<User | null>  {
        let values = await Database.read({username: user}, "users");
        if (values.length != 0) return values[0];
        return null;
    }

};