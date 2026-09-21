using CsvHelper.Configuration;
using RetailPricing.API.Models;

namespace RetailPricing.API.Models
{
    public class RetailPricingCsvMap : ClassMap<RetailPricing>
    {
        public RetailPricingCsvMap()
        {
            Map(m => m.StoreId).Name("StoreId");
            Map(m => m.SKU).Name("SKU");
            Map(m => m.ProductName).Name("ProductName");
            Map(m => m.Price).Name("Price");
            Map(m => m.PriceDate).Name("PriceDate");

            // PricingId comes from SQL Server Identity column.
            Map(m => m.PricingId).Ignore();
        }
    }
}