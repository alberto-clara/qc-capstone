namespace CheckoutApi.Models {

    public class UserInfo {
        public string Uid { get; set; }
        public string Email { get; set; }
        public Name Full_name { get; set; }
        public Address First_address { get; set; }
        public Address Second_address { get; set; }
        public Phone_numb Phone_number { get; set; }
    }

    public class Name {
        public string First_name { get; set; }
        public string Middle_name { get; set; }
        public string Last_name { get; set; }
    }

    public class Address {
        public string Street { get; set; }
        public string Apt { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public int Zip_code { get; set; }
    }

    public class Phone_numb {
        public Phone_num Primary_phone { get; set; }
        public Phone_num Secondary_phone { get; set; }
    }

    public class Phone_num {
        public string Phone { get; set; }
        public string Ext { get; set; }
    }
}
