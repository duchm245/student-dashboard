
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {debounceTime, delay, filter, map} from "rxjs";
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {ErrorStateMatcher} from "@angular/material/core";
import {StudentService} from "../../service/student.service";
import {ClazzService} from "../../service/clazz.service";
import {CommonService} from "../../service/common.service";

export interface Class {
  id: string,
  name: string
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-select-clazz-dialog',
  templateUrl: './select-clazz-dialog.component.html',
  styleUrls: ['./select-clazz-dialog.component.scss']
})


export class SelectClazzDialogComponent implements OnInit {
  public submitted = false;
  public matcher = new MyErrorStateMatcher();
  public listClassFromApi: Class[] = [];
  public classFilterCtrl: FormControl<string | null> = new FormControl<string>('');
  public newSelectClazzForm = new FormGroup({
    clazzId: new FormControl(0, [Validators.required])
  })

  constructor(private studentService: StudentService,
              private clazzService: ClazzService,
              private commonService: CommonService,
              private _snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<SelectClazzDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { stId: any, classId: any } // Inject giá trị từ data của GetListStudentComponent vào đây
  ) {
  }

  /**
   * pipe:  phương thức của đối tượng Observable, cho phép thực hiện một loạt các phép biến đổi trên giá trị của Observable trước khi xử lý
   * filter(search => !!search): lọc ra các giá trị không null/undefined
   * tap : thiết lập giá trị của biến searching là true, đánh dấu rằng đang trong quá trình tìm kiếm
   * debounceTime: để giảm tần suất của các sự kiện tìm kiếm, chỉ xử lý sự kiện cuối cùng sau 200ms kể từ khi người dùng nhập vào trường tìm kiếm.
   * map(search => { ... }): Đây là một phép biến đổi sử dụng toán tử map để thực hiện một số xử lý trên giá trị của trường tìm kiếm (search field).
   *
   */
  ngOnInit(): void {
    // code them: thay vi lay het tat ca cac lop, chi lay ra 5 lop moi nhat
    this.clazzService.getAllListClazz().subscribe(data => {
      this.listClassFromApi = data.data;
    })
    this.newSelectClazzForm.setValue({
      clazzId: this.data.classId
    })

    this.classFilterCtrl.valueChanges
      .pipe(
        filter((search: any) => !!search),
        debounceTime(500),
        map((search) => {
          if (!this.listClassFromApi) {
            return [];
          }
          // Gọi API để lấy dữ liệu từ backend
          this.clazzService.getListClazzFilterLikeClassName(this.classFilterCtrl.value).subscribe((data) => {
            this.listClassFromApi = data.data;
          }, error => {
            console.log(error);
          });
          // simulate server fetching and filtering data
          return this.listClassFromApi.filter((clazz: { name: string; }) => clazz.name.toLowerCase().indexOf(search) > -1);
        }), delay(500)).subscribe()
  }

  public selectClazz() {
    if (!this.newSelectClazzForm.value.clazzId || this.newSelectClazzForm.value.clazzId === 0) {
      this.dialogRef.close();
      return;
    }
    const data = {
      studentId: this.data.stId,
      classId: this.newSelectClazzForm.value.clazzId
    }
    console.log("data: " + JSON.stringify(data));
    this.commonService.selectClazz(data).subscribe(() => {
      this.submitted = true;
    }, error => {
      console.log(error);
    })
    // this.toastrService.success('Student was submitted successfully!!');
    // this._snackBar.open("Lưu học sinh thành công", "exit", {duration: 2000});
    this.showSnackBar();
    this.dialogRef.close();
    // location.reload();
  }

  showSnackBar() {
    const config = new MatSnackBarConfig();
    config.duration = 5000; // Độ dài hiển thị của snackbar (tính theo milliseconds)
    config.horizontalPosition = 'end'; // Tùy chọn vị trí ngang ('start', 'center', 'end', 'left', 'right')
    config.verticalPosition = 'top'; // Tùy chọn vị trí dọc ('top', 'bottom')
    this._snackBar.open("Phân lớp cho học sinh thành công", "exit", config);
  }

}
