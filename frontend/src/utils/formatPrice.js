export const formatPrice = (price) => {
    price = `${price}`;
    let fmtPrice = price.slice(0, 3) + "." + price.slice(3) + "c";
    return fmtPrice;
}