import { getRepository } from "typeorm";
import { CreateReservationInput } from "../../graphql/mutation/createReservation";
import { Transport } from "../entity/Transport";
import { Reservation } from "../entity/Reservation";
import { pubSub } from '../../pubSubProvider';
import { toReservationModel } from "../../transformers";

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

    pubSub.publish('notification', {
        notification: toReservationModel(res)
    })

    return transport;
}