# Retail Pricing Management System

## Overview
A single-page retail pricing management application developed for the Tiger Analytics case study.

## Features
- CSV pricing feed upload
- SQL Server persistence
- Pricing search by Store ID, SKU and Product Name
- Inline pricing record edit and save

## Technology Stack
- Angular / TypeScript / HTML / CSS
- ASP.NET Core Web API (.NET 10)
- Entity Framework Core
- CsvHelper
- SQL Server

## Architecture
Angular UI communicates with the ASP.NET Core Web API using REST APIs. The API uses CsvHelper for CSV processing and EF Core for SQL Server persistence.

## API Endpoints
- GET /api/RetailPricing
- POST /api/RetailPricing/upload
- GET /api/RetailPricing/search
- PUT /api/RetailPricing/{id}

## Documentation
See the `docs` folder for:
- Context-Diagram.png
- Solution-Architecture.png
- Retail-Pricing-Case-Study.pdf

## Security Note
Do not commit passwords, API keys, certificates or production connection strings.
