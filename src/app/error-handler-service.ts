import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HttpError } from "./models/error.enum";
import { ErrorModalComponent } from "./shared/error-modal/error-modal.component";
@Injectable()
export class ErrorHandlerService implements ErrorHandler {

    constructor(
        private injector: Injector,
        private ngzone: NgZone) {}
    handleError(error: any): void {
        let dialog: MatDialog = this.injector.get(MatDialog)
        if(error instanceof HttpErrorResponse) {
            // const toastr = this.injector.get(ToastrService);
            // const translate = this.injector.get(TranslateService);
            let message = '', title = '';
            const handleErrorMessage = (_toastMessage: any, _toastTitle: any) => {
                console.log(_toastMessage, _toastTitle);
                // message = translate(_toastMessage);
                // title = translate(_toastTitle);
                // toastr.error(message, title, {timeOut: 1000})
            }
            switch(error.status) {
                case HttpError.BadRequest:
                    handleErrorMessage('errors.400Message', 'errors.400Title');
                    break;
                case HttpError.Unauthorized:
                    handleErrorMessage('errors.400Message', 'errors.400Title');
                    break;
                default:
                    break;
            }
            if(error.message === 'Inactive')
            this.ngzone.run(() => {
                dialog.open(ErrorModalComponent)
            })
            else {
                console.error(error)
             };
            
            
        } else {

        }
    }
}
