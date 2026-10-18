import jwt from 'jsonwebtoken';
import {users} from "./data.js";

//наш секретний ключ,яким сервер перевіряє токени
export const JWT_SECRET = "dm-system-secret-key-2026";

//1 Створення токена при успіху
export function createToken(user){
    return jwt.sign({userId:user.id},JWT_SECRET,{expiresIn: "1h"});
}

//2 Отримання користувача з токена в нашій базі(Розшифрування токена)
export function getUserFromToken(token){
    if(!token) return null;

    try{
        //перевірка підпису токенів
        const payload = jwt.verify(token,JWT_SECRET);

        //пошук користувача за його UserId з токена
        const user = users.find((u) => u.id === payload.userId);
        return user || null;
    } catch(error){
        //Якщо токен недійсний, прострочений або зіпсований
        return null;
    }
}

//3 Витягування токена із HTTP заголовка
export function getUserFromAuthHeader(authHeader){
    if (!authHeader) return null;

    //розділяємо рядок за пробілами на масив
    const parts = authHeader.split(' ');

    if(parts.length === 2 && parts[0] === 'Bearer'){
        const token = parts[1];
        return getUserFromToken(token);
    }
    return null;
}