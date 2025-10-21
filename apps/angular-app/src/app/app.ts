import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../environments/environment';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher';
import { VersionSwitcherComponent } from './components/version-switcher/version-switcher';
import { BackToTopComponent } from './components/back-to-top/back-to-top.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, MatIconModule, ThemeSwitcherComponent, VersionSwitcherComponent, BackToTopComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('老乡鸡菜谱预览');
  protected readonly repoUrl = environment.repoUrl;
}
