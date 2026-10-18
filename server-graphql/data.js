//Users
export const users = [];
//Products
export const products = [];

let userIdCounter = 1;
let productIdCounter = 1;

//Функція для отримання наступного ID користувача
export function getNextUserId(){
    return String(userIdCounter++);
}

//Функція для отримання наступного ID товару
export function getNextProductId(){
    return String(productIdCounter++);
}
