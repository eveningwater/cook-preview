import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { createVersionSwitcher } from '@cook/core';

@Component({
  selector: 'app-version-switcher',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatOptionModule],
  templateUrl: './version-switcher.html',
  styleUrl: './version-switcher.scss'
})
export class VersionSwitcherComponent {
  currentVersion = 'angular';
  private versionSwitcher = createVersionSwitcher();
  
  versions = [
    { 
      key: 'angular', 
      name: 'Angular版本', 
      icon: 'web',
      disabled: true 
    },
    { 
      key: 'vue', 
      name: 'Vue版本', 
      icon: 'view_module',
      disabled: false 
    },
    { 
      key: 'react', 
      name: 'React版本', 
      icon: 'extension',
    }
  ];

  onVersionChange(event: any): void {
    const selectedVersion = event.value;
    const version = this.versions.find(v => v.key === selectedVersion);
    
    if (version && !version.disabled) {
      this.versionSwitcher.switchToVersion(version.key);
    }
  }
}
