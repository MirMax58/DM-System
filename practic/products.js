import { users, products } from './data.js';

export const resolvers = {
    Query:{
        users:() => users,

        products:() => products
    }
};