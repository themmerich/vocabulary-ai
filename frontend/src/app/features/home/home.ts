import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-home',
  imports: [TranslocoPipe, CardModule],
  template: `
    <p-card>
      <ng-template #title>{{ 'home.welcome' | transloco }}</ng-template>
      <p>{{ 'home.placeholder' | transloco }}</p>
    </p-card>
  `,
})
export class Home {}
