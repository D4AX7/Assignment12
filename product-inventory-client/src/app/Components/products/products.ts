import { CommonModule } from '@angular/common';
import { Component, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { Product } from './../../models/product';
import { ProductService } from '../../services/product-service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements AfterViewInit {

  displayedColumns: string[] = [
    'id',
    'name',
    'description',
    'price',
    'quantity',
    'category',
    'createdDate',
    'isActive',
    'actions'
  ];

  dataSource = new MatTableDataSource<Product>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('productFormRef') productFormElement!: ElementRef;
  @ViewChild('tableContainer') tableContainer!: ElementRef;

  
  productForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    quantity: new FormControl(0, Validators.required),
    category: new FormControl('', Validators.required),
    createdDate: new FormControl(new Date()),  
    isActive: new FormControl(true)
  });

  isEditMode = false;

  constructor(private productService: ProductService, private snackBar: MatSnackBar, private router: Router) {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.dataSource.data = data;
    });
  }

  saveProduct() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.snackBar.open('Please fill in all required fields', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const formValue = this.productForm.value as any;
    
    const dateValue = formValue.createdDate instanceof Date 
      ? formValue.createdDate 
      : new Date(formValue.createdDate);
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`; 

    const product: any = {
      name: formValue.name,
      description: formValue.description,
      price: Number(formValue.price),
      quantity: Number(formValue.quantity),
      category: formValue.category,
      isActive: !!formValue.isActive,
      createdDate: formattedDate  
    };

    if (this.isEditMode) {
      product.id = formValue.id;
      this.productService.updateProduct(product)
        .subscribe(() => this.loadProducts());
    } else {
      this.productService.addProduct(product)
        .subscribe(() => {
          this.loadProducts();
          this.scrollToTable();
        });
    }

    this.resetForm();
  }

  editProduct(p: Product) {
    this.productForm.patchValue({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      quantity: p.quantity,
      category: p.category,
      isActive: p.isActive,
      createdDate: new Date(p.createdDate)
    });
    this.isEditMode = true;
    this.scrollToForm();
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id)
      .subscribe(() => this.loadProducts());
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
    this.router.navigate(['/login'], { replaceUrl: true, queryParams: { loggedOut: '1' } });
  }

  resetForm() {
    this.productForm.reset({
      id: 0,
      isActive: true,
      createdDate: new Date()
    });
    this.isEditMode = false;
  }

  
  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  
  scrollToForm() {
    if (this.productFormElement) {
      setTimeout(() => {
        this.productFormElement.nativeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  }

  scrollToTable() {
    if (this.tableContainer) {
      setTimeout(() => {
        this.tableContainer.nativeElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 300);
    }
  }
}
