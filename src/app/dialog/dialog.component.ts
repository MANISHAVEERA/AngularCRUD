import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validator, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MatDialogRef ,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  productStateList=["Brand New","Second Hand","Refurbished"];
  productForm!:FormGroup;
  actionBtn:string="Save"
  constructor(private formbuilder:FormBuilder,private api:ApiService,private dialogRef:MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData:any ) { }

  ngOnInit(): void {
    this.productForm=this.formbuilder.group({
      productName:['',Validators.required],
      Category:['',Validators.required],
      productState:['',Validators.required],
      price:['',Validators.required],
      comment:['',Validators.required],
      date:['',Validators.required],
    })

    if(this.editData){
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['Category'].setValue(this.editData.Category);
      this.productForm.controls['productState'].setValue(this.editData.productState);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comment'].setValue(this.editData.comment);
      this.actionBtn="Update";
    }
  }

  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value).subscribe({
          next:(res)=>{
            alert("Product added successfully");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("Something went wrong")
          }
        })
      }
    }
    else{
      this.updateProduct();
    }
  }

  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id).subscribe({
      next:(res)=>{
        alert("Updated successfully")
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("Error while updating the record")
      }
    })
  }

}
