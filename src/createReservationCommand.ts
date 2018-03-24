import { Transport } from "./entity/Transport";
import { getRepository } from "typeorm";
import { Reservation } from "./entity/Reservation";
import { CreateReservationInput } from "../mutations/createReservation";

export default async function(
    input: CreateReservationInput)
    :Promise<Transport> 
{
    const repo = getRepository(Transport);

    let transport = await repo.findOne({
        where: {
            graphId: input.transportId
        }
    })

    let res = new Reservation();
    res.type = <any>input.type;
    res.description = input.description;
    res.price = input.price;
    res.exchangeRequest = input.exchangeRequest;

    transport.reservations.push(res);
    transport = await repo.save(transport);
    return transport;
}