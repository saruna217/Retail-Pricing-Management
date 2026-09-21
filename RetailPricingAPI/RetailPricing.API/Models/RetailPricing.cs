using System.ComponentModel.DataAnnotations;
namespace RetailPricing.API.Models
{
    public class RetailPricing
    {
        [Key]
        public int PricingId { get; set; }
        public string StoreId { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public DateTime PriceDate { get; set; }
    }
}
