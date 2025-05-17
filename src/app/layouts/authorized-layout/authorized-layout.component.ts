import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authorized-layout',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './authorized-layout.component.html',
})
export class AuthorizedLayoutComponent {}
