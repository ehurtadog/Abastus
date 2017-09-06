import { Injectable } from '@angular/core';

@Injectable()
export class Logger {
  public static LeadInStyle = 'font-weight: bold; color: green';

  public static banner(text): void {
    console.log(`%c  ${text}  `, "color: white; font-size: 15px; background-color: #666666; width: 100%");
  }

  public static heading(text): void {
    console.log(`%c  ${text}  `, "color: white; color: #666666; background-color: #F2F2F2; width: 100%");
  }
  
}
