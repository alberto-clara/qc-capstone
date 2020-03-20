using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;

namespace CheckoutApi.Models
{
    public class Checkout
    {
        public List<Order> Orders { get; set; }
    }

    public class Order
    {
        public Guid? OrderId { get; set; }
        public DateTime? date { get; set; }
        public int total_items { get; set; }
        public decimal total_cost { get; set; }
        public List<Offerings> Offerings { get; set; }
        public UserInfo Shipping { get; set; }
//        public ShippingInfo Shipping { get; set; }

        /*

        public ShippingInfo ShippingInfo()
        {
            Console.WriteLine("ShippingInfo()");
            if (_Shipping != null)
            {
                Console.WriteLine("if (_Shipping != null)");
                if (_Shipping.Full_name.First_name != "" && _Shipping.Full_name.Last_name != "")
                {
                    if (_Shipping.Full_name.Middle_name != "")
                        Shipping.Full_name = _Shipping.Full_name.First_name + ' ' + _Shipping.Full_name.Middle_name + ' ' + _Shipping.Full_name.Last_name;
                    else
                        Shipping.Full_name = _Shipping.Full_name.First_name + ' ' + _Shipping.Full_name.Last_name;

                    Console.WriteLine($"Full_name = {Shipping.Full_name}");
                }
                else
                    Shipping.Full_name = null;

                if (_Shipping.First_address.Street != "")
                {
                    if (_Shipping.First_address.Apt != "")
                        Shipping.Address = _Shipping.First_address.Street + ' ' + _Shipping.First_address.Apt;
                    else
                        Shipping.Address = _Shipping.First_address.Street;
                    if (_Shipping.First_address.City != "" && _Shipping.First_address.State != "" && _Shipping.First_address.Zip_code != 0)
                    {
                        Shipping.Address += ' ' + _Shipping.First_address.City + ", " + _Shipping.First_address.State + ' ' + _Shipping.First_address.Zip_code.ToString();
                    }
                }
                else
                    Shipping.Address = null;

                Shipping.Email = _Shipping.Email;
            }
            else
                Shipping = null;

            return Shipping;
        }
        */
    }

    public class Offerings
    {
        public string Offering_key { get; set; }
        public string Product_key { get; set; }
        public string Product_name { get; set; }
        public string Supplier_key { get; set; }
        public string Supplier_name { get; set; }
        public decimal Unit_retail { get; set; }
        public string totalOfferingCost { get; set; }
        public string Uom { get; set; }
        public int Quantity { get; set; }
        
    }

    /*public class ShippingInfo
    {
        public string Full_name { get; set; }
        public string First_name { get; set; }
        public string Last_name { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string State { get; set; }
        public int ZipCode { get; set; }
        public string Phone_number { get; set; }
    } */
}
