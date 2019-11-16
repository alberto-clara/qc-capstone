using System;
using System.Linq;
using System.IO;
using System.Collections.Generic;


namespace JOINLINQ
{
    class Program
    {
        static void Main()
        {

        string[] products = System.IO.File.ReadAllLines(@"products.csv");  
        string[] offerings = System.IO.File.ReadAllLines(@"offerings.csv");  
  
        // Name:    Last[0],       First[1],  ID[2]  
        //          Omelchenko,    Svetlana,  11  
        // Score:   StudentID[0],  Exam1[1]   Exam2[2],  Exam3[3],  Exam4[4]  
        //          111,           97,        92,        81,        60  
  
        // This query joins two dissimilar spreadsheets based on common ID value.  
        // Multiple from clauses are used instead of a join clause  
        // in order to store results of id.Split.  
        IEnumerable<string> scoreQuery1 =  
            from name in products.Skip(1)
            let productFields = name.Split(',')  
            from id in offerings.Skip(1)
            let offeringsFields = id.Split(',')  
            where productFields[0].Equals(offeringsFields[7])
            select productFields[0] + ",  Product Name: " + productFields[1] + ",  Cost: " + offeringsFields[5]   
                   + ",  Date Created: " + productFields[3];  
  
        // Pass a query variable to a method and execute it  
        // in the method. The query itself is unchanged.  
        OutputQueryResults(scoreQuery1, "Merge two spreadsheets:");  
  
        // Keep console window open in debug mode.  
        Console.WriteLine("Press any key to exit");  
        Console.ReadKey();  
    }  
  
    static void OutputQueryResults(IEnumerable<string> query, string message)  
    {  
        Console.WriteLine(System.Environment.NewLine + message);  
        foreach (string item in query)  
        {  
            Console.WriteLine(item);  
        }  
        //Console.WriteLine("{0} total names in list", query.Count());  
    }  
 }  
} 