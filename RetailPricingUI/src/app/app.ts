import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

import {
  RetailPricingService,
  RetailPricing
} from './retail-pricing.service';

import { switchMap, finalize } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    FormsModule,
    DecimalPipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // ==============================
  // Pricing records
  // ==============================

  pricingRecords: RetailPricing[] = [];

  // ==============================
  // Search
  // ==============================

  searchStoreId = '';
  searchSku = '';
  searchProductName = '';

  isSearching = false;

  // ==============================
  // Edit
  // ==============================

  editingRecordId: number | null = null;

  editRecordData: RetailPricing | null = null;

  isSaving = false;

  // ==============================
  // Upload
  // ==============================

  selectedFile: File | null = null;

  fileInputElement: HTMLInputElement | null = null;

  isUploading = false;

  // ==============================
  // Messages
  // ==============================

  successMessage = '';

  errorMessage = '';

  // ==============================
  // Services
  // ==============================

  private retailPricingService = inject(RetailPricingService);

  private cdr = inject(ChangeDetectorRef);


  // ==============================
  // Initial load
  // ==============================

  ngOnInit(): void {
    this.loadPricingRecords();
  }


  // ==============================
  // Load all records
  // ==============================

  loadPricingRecords(): void {

    this.retailPricingService
      .getAll()
      .subscribe({

        next: (records) => {

          this.pricingRecords = [...records];

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error loading pricing records:',
            error
          );

          this.errorMessage =
            'Unable to load pricing records.';

          this.cdr.detectChanges();
        }

      });
  }


  // ==============================
  // File selected
  // ==============================

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.successMessage = '';
    this.errorMessage = '';

    if (!input.files || input.files.length === 0) {

      this.selectedFile = null;
      this.fileInputElement = null;

      this.cdr.detectChanges();

      return;
    }

    const file = input.files[0];

    // CSV validation

    if (!file.name.toLowerCase().endsWith('.csv')) {

      this.selectedFile = null;

      input.value = '';

      this.fileInputElement = null;

      this.errorMessage =
        'Please select a valid CSV file.';

      this.cdr.detectChanges();

      return;
    }

    this.selectedFile = file;

    this.fileInputElement = input;

    this.cdr.detectChanges();
  }


  // ==============================
  // Upload CSV
  // ==============================

  uploadCsv(): void {

    if (!this.selectedFile || this.isUploading) {
      return;
    }

    const file = this.selectedFile;

    this.isUploading = true;

    this.successMessage = '';
    this.errorMessage = '';

    this.retailPricingService
      .uploadCsv(file)
      .pipe(

        // After successful upload,
        // immediately reload records from DB.

        switchMap(() =>
          this.retailPricingService.getAll()
        ),

        finalize(() => {

          this.isUploading = false;

          this.cdr.detectChanges();
        })

      )
      .subscribe({

        next: (records) => {

          // Refresh table

          this.pricingRecords = [...records];

          // Clear selected file

          this.clearFileSelection();

          // Success message

          this.successMessage =
            'CSV uploaded successfully and pricing records have been refreshed.';

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error uploading CSV:',
            error
          );

          this.errorMessage =
            'CSV upload failed. Please check the file and try again.';

          this.cdr.detectChanges();
        }

      });
  }


  // ==============================
  // Clear file selection
  // ==============================

  clearFileSelection(): void {

    this.selectedFile = null;

    if (this.fileInputElement) {

      this.fileInputElement.value = '';
    }

    this.fileInputElement = null;

    this.cdr.detectChanges();
  }


  // ==============================
  // Search
  // ==============================

  searchRecords(): void {

    this.isSearching = true;

    this.successMessage = '';
    this.errorMessage = '';

    this.retailPricingService
      .search(
        this.searchStoreId.trim(),
        this.searchSku.trim(),
        this.searchProductName.trim()
      )
      .pipe(

        finalize(() => {

          this.isSearching = false;

          this.cdr.detectChanges();
        })

      )
      .subscribe({

        next: (records) => {

          this.pricingRecords = [...records];

          this.cdr.detectChanges();
        },

        error: (error) => {

          console.error(
            'Error searching pricing records:',
            error
          );

          this.errorMessage =
            'Unable to search pricing records.';

          this.cdr.detectChanges();
        }

      });
  }


  // ==============================
  // Clear search
  // ==============================

  clearSearch(): void {

    this.searchStoreId = '';

    this.searchSku = '';

    this.searchProductName = '';

    this.successMessage = '';
    this.errorMessage = '';

    this.loadPricingRecords();
  }


  // ==============================
  // Edit record
  // ==============================

  editRecord(record: RetailPricing): void {

    this.successMessage = '';
    this.errorMessage = '';

    this.editingRecordId = record.pricingId;

    this.editRecordData = {
      ...record,
      priceDate: record.priceDate.substring(0, 10)
    };

    this.cdr.detectChanges();
  }


  // ==============================
  // Cancel edit
  // ==============================

  cancelEdit(): void {

    this.editingRecordId = null;

    this.editRecordData = null;

    this.isSaving = false;

    this.cdr.detectChanges();
  }


  // ==============================
  // Save edited record
  // ==============================

  saveRecord(): void {

    if (!this.editRecordData || this.isSaving) {
      return;
    }

    const id =
      this.editRecordData.pricingId;

    this.isSaving = true;

    this.successMessage = '';
    this.errorMessage = '';

    this.retailPricingService
      .update(
        id,
        this.editRecordData
      )
      .pipe(

        finalize(() => {

          this.isSaving = false;

          this.cdr.detectChanges();
        })

      )
      .subscribe({

        next: () => {

          this.editingRecordId = null;

          this.editRecordData = null;

          this.successMessage =
            'Pricing record updated successfully.';

          // Reload latest data

          this.loadPricingRecords();
        },

        error: (error) => {

          console.error(
            'Error updating record:',
            error
          );

          this.errorMessage =
            'Unable to update pricing record.';

          this.cdr.detectChanges();
        }

      });
  }

}