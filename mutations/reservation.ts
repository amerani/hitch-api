export const schema = [
    `
        extend type Mutation {
            createReservation(
                type: RESERVATION_TYPE!
                description: String
            ):Reservation
        }
    `
]

export const resolver = {
    Mutation: {
        createReservation: async(root, props, ctx) => {
            const {type, description} = props;
            return {
                id: "fdbf2b54-dbe5-4aef-a94d-070461ce6bca",
                type: type,
                description: description
            }
        }
    }
}