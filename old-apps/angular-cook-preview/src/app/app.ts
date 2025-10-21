import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../environments/environment';
import { ThemeSwitcherComponent } from './components/theme-switcher/theme-switcher';
import { VersionSwitcherComponent } from './components/version-switcher/version-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ThemeSwitcherComponent, VersionSwitcherComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('🥢 老乡鸡菜谱预览');
  protected readonly repoUrl = environment.repoUrl;
}
