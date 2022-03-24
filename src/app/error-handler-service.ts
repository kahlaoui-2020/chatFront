import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, Injector, NgZone } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ErrorModalComponent } from "./shared/error-modal/error-modal.component";

@Injectable()
export class ErrorHandlerService implements ErrorHandler {

    constructor(
        private injector: Injector,
        private ngzone: NgZone) {}
    handleError(error: any): void {
        let dialog: MatDialog = this.injector.get(MatDialog)
        if(error instanceof HttpErrorResponse) {

            if(error.message === 'Inactive')
            this.ngzone.run(() => {
                dialog.open(ErrorModalComponent)
            })
            else console.error(error)
            
        } else {

        }
    }
}
