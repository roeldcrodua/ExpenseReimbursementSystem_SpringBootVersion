import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GenericService {
  // Single source of truth for API base URL
  public apiBase: string = environment.apiBase;

  // Backwards compatibility: preserve existing fields used by other services
  public _localServerDomain: string = this.apiBase;
  public _localClientDomain: string = this.apiBase; // not used for calls, kept for compatibility

  constructor() { }
}
