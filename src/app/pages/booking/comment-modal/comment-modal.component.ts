import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxScannerQrcodeService, ScannerQRCodeConfig, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode';
import { ToastrService } from 'ngx-toastr';
import { BookingService } from 'src/app/services/module/booking.service';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.css']
})
export class CommentModalComponent implements OnInit {

  @Input() item: any;
  @Output() passEntry: EventEmitter<any> = new EventEmitter;

  form: any;
  isSubmit = false;

  listComment = [
    {
      name: "Very Satisfying"
    },
    {
      name: "Satisfying"
    },
    {
      name: "Disappointed"
    },
  ]

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private bookingService: BookingService,
    private toastService: ToastrService,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  get f() {
    return this.form.controls;
  }

  initForm() {
    this.form = this.formBuilder.group({
      id: [this.item?.id],
      attitude: [null, Validators.required],
      comment: [null, [Validators.maxLength(500)]]
    })
  }

  submit() {
    if(this.form.status === "INVALID"){
      return;
    }
    
    const json = {
      ...this.item,
      attitude: this.f.attitude.value,
      comment: this.f.comment.value
    }
    
    this.bookingService.updateBooking(json).subscribe(res => {
      if(res.errorCode === '0'){
        this.toastService.success("Your comment has saved");
        this.passEntry.emit(res);
      }else {
        this.toastService.error(res.errorDesc);
      }
    })
  }

  close() {
    this.activeModal.dismiss();
  }

  

}
