//створюємо масиви
export const users = [];
export const products = [];

//лічильник
let usersCounter = 1;
let productsCounter = 1;

//функції для повертання ID у вигляді рядка
export function getNextUserId(){
    return String(usersCounter++);
}
export function getNextProductId(){
    return String(productsCounter++);
}