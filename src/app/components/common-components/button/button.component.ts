import { NgClass } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [NgClass],
  templateUrl: "./button.component.html",
})
export class ButtonComponent {
  @Input() text: string = "";
  @Input({ required: true }) type: "submit" | "button" | "reset" = "button";
  @Input() disabled: boolean = false;
  @Input({ required: true }) class!: string;
  @Input() ngClass!: Record<string, boolean>;
}
