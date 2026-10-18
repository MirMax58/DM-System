import bcrypt from 'bcryptjs';
import {users,products,getNextUserId,getNextProductId} from './data.js';
import {createToken} from './auth.js';

// Запити на читання
export const resolvers = {
    Query:{
        //Перевіряє списки усіх користувачів
        users:() => users,

        //Повертає дані поточного авторизованого користувача з context.user
        me:(parent,args,context) =>{
            return context.user || null;
        },

        //Повертає список усіх товарів
        products:() => products,
    },

    Mutation: {
        register: async (parent, { name, email, password }) => {
            const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
            if (existingUser) {
                throw new Error('Користувач з таким email вже існує.');
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = {
                id: getNextUserId(),
                name,
                email,
                passwordHash,
            };

            users.push(newUser);

            const token = createToken(newUser);

            return { token, user: newUser };
        },

        login: async (parent, { email, password }) => {
            const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
            if (!user) {
                throw new Error('Невірний email або пароль.');
            }

            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) {
                throw new Error('Невірний email або пароль.');
            }

            const token = createToken(user);
            return { token, user };
        },

        createProduct: (parent, { name, price, stock }, context) => {
            if (!context.user) {
                throw new Error('Потрібна авторизація.');
            }

            const newProduct = {
                id: getNextProductId(),
                name,
                price,
                stock,
                ownerId: context.user.id,
            };

            products.push(newProduct);
            return newProduct;
        },

        deleteProduct: (parent, { id }, context) => {
            if (!context.user) {
                throw new Error('Потрібна авторизація.');
            }

            const index = products.findIndex((p) => p.id === id);
            if (index === -1) {
                return false;
            }

            products.splice(index, 1);
            return true;
        },
    },

    Product: {
        owner: (parent) => {
            return users.find((u) => u.id === parent.ownerId);
        },
    },
}

