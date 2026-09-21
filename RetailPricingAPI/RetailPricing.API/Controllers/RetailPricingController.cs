using CsvHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RetailPricing.API.Data;
using RetailPricing.API.Models;
using System.Globalization;

namespace RetailPricing.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetailPricingController : ControllerBase
    {
        private readonly RetailPricingDbContext _context;

        public RetailPricingController(RetailPricingDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var pricingRecords = await _context.RetailPricings.ToListAsync();
            return Ok(pricingRecords);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(string? storeId, string? sku, string? productName)
        {
            var query = _context.RetailPricings.AsQueryable();

            if (!string.IsNullOrWhiteSpace(storeId))
            {
                query = query.Where(x => x.StoreId == storeId);
            }

            if (!string.IsNullOrWhiteSpace(sku))
            {
                query = query.Where(x => x.SKU == sku);
            }

            if (!string.IsNullOrWhiteSpace(productName))
            {
                query = query.Where(x => x.ProductName.Contains(productName));
            }

            var results = await query.ToListAsync();

            return Ok(results);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Models.RetailPricing updatedPricing)
        {
            var existingPricing = await _context.RetailPricings
                .FindAsync(id);

            if (existingPricing == null)
            {
                return NotFound($"Pricing record with ID {id} not found.");
            }

            existingPricing.StoreId = updatedPricing.StoreId;
            existingPricing.SKU = updatedPricing.SKU;
            existingPricing.ProductName = updatedPricing.ProductName;
            existingPricing.Price = updatedPricing.Price;
            existingPricing.PriceDate = updatedPricing.PriceDate;

            await _context.SaveChangesAsync();

            return Ok(existingPricing);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadCsv(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("Please upload a CSVfile");
            }

            if (!Path.GetExtension(file.FileName).Equals(".csv", StringComparison.OrdinalIgnoreCase))
            {
                return BadRequest("Only CSV files are supported.");
            }

            using var reader = new StreamReader(file.OpenReadStream());
            using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            csv.Context.RegisterClassMap<RetailPricingCsvMap>();
            var records = csv.GetRecords<Models.RetailPricing>().ToList();
            if (records.Count == 0)
            {
                return BadRequest("CSV file does not contain any records.");
            }
            await _context.RetailPricings.AddRangeAsync(records);
            await _context.SaveChangesAsync();
            return Ok(new
            {
                Message = "CSV uploaded successfully.",
                RecordsInserted = records.Count,
            });
        }
    }
}
