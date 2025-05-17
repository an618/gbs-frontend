import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-unauthorized-layout",
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: "./unauthorized.layout.html",
})
export class UnAuthorizedLayoutComponent {}
