import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chatFront';
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer) {

    this.matIconRegistry.addSvgIcon('dark_mode_black', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/dark_mode_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('light_mode_black', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/light_mode_black_24dp.svg"));

    this.matIconRegistry.addSvgIcon('send', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/send_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('duo', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/duo_black_24dp.svg"));
    this.matIconRegistry.addSvgIcon('whatsapp', this.domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/whatsapp_black_24dp.svg"));

  }

  ngOnInit() {
    
  }
}
