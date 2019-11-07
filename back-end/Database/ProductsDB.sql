create table products (
		Id char(32),
        Product_name varchar(500),
        Long_description varchar(1000),
        Created_date int,
        Active_date int,
        primary key(Id)
);

create table suppliers (
	Id char(32),
    Supplier_name varchar(500),
    Created_date int,
    Active_date int,
    primary key(Id)
);

create table offerings (
	Id char(32),
    Created_date int,
    Active_date int,
    Expiration_date int,
    Unit_retail decimal(15, 10),
    Unit_cost decimal(15, 10),
    Uom varchar(15),
    Product_key char(32),
    Supplier_key char(32),
    primary key (Id),
    foreign key(Product_key) references products.products(Id),
    foreign key(Supplier_key) references products.suppliers(Id)
);

