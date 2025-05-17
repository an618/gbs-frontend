import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ButtonComponent } from "@app/components/common-components";

@Component({
  selector: "app-card",
  standalone: true,
  imports: [NgIf, ButtonComponent],
  templateUrl: "./card.component.html",
})
export class CardComponent {
  @Input() title: string = "";
}
