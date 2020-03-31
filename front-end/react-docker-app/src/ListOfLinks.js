import React from 'react';
import './css/loader/three-dot.css';
const APIport = 7000;
const env = process.env.REACT_APP_API_URL + ':' + APIport;

export const GetCart = env + "/basket-api/basket/find";
export const PlaceOrder = env + "/checkout-api/checkout/add";
export const OrderHistoryLink = env + "/checkout-api/checkout/getOrderHistory";
export const PutCartUpdate = (offer, num) => { return env + "/basket-api/basket/update/" + offer + "/" + num; }

export const GetBrowsingTotal = env + "/catalog-api/products/page?"; 
export const GetBrowsing1 = (numb, page) => {
    return env + "/catalog-api/products/page?pageSize=" + numb + "&pageIndex=" + (page);}
export const GetBrowsing2 = (sortPrice, number, location) => {
    return env + "/catalog-api/products/page/" + sortPrice + "?pageSize=" + number + "&pageIndex=" + (location);}

export const GetProduct = (offerID) => { return env + "/catalog-api/products/offerings/single/" + offerID }
export const GetDiscOffer = (offerID) => { return env + "/catalog-api/products/disc/singleOffering/" + offerID }
export const PostProduct = env + "/basket-api/basket/add";
export const GetVendors = (offerID) => { return env + "/catalog-api/products/offerings/" + offerID }

export const GetUserInfo = env + "/checkout-api/checkout/getUserInfo";
export const PostUserInfo = env + "/checkout-api/checkout/addUserInfo";

export const GetHomeRandom = env + "/catalog-api/products/home";

export const TokenHeader = (tokenID) => {
    var config = {
        headers: {
            'Authorization': 'Bearer '.concat(tokenID)
        }
    }
    return config;
}

export const loader = (<><div className="dot-spin" /></>)