const products = [
    {id:'343',
    name:'iphone',
    price:1300},
    {id:'12',
    name:'HP',
    price:45000}
]

function getProducts(){
    return products;
}

console.log(getProducts())

function getProductsById(id){
    const finding = products.find(product => product.id === id);
    return finding;
}
console.log(getProductsById(products[0].id))

//створення товару
function addProduct(name,price){
    const newProduct = {
        id:String(products.length+1),
        name,
        price
    };

    products.push(newProduct);

    return newProduct;
}

console.log(addProduct("mouse",200));
console.log(getProducts());

//Видалення товару
function deleteProduct(id){

}