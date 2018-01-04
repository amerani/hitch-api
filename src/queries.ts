import { getRepository } from "typeorm";
import { User } from "./entity/User";

export function readWithCreatedReservations(creatorId: number){
    return getRepository(User)
    .createQueryBuilder("u")
    .leftJoinAndSelect("u.reservationsCreated", "r")
    .where("u.id = :id", {id: creatorId})
    .getOne();
}