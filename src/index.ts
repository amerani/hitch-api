import "reflect-metadata";
import {createConnection, getConnection} from "typeorm";
import {createRoundTripListing} from "./examples/createRoundTripListing";

createConnection().then(async connection => {

    await createRoundTripListing();

    connection.close();

}).catch(error => {
    console.log(error);
    getConnection().close();
});
