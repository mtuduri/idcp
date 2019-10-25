import { FormlyFieldButtonComponent } from '../custom-field/button-type.component';
import { RepeatTypeComponent } from '../custom-field/repeat-section.component';
export const fields = [
    {
        name: 'button',
        component: FormlyFieldButtonComponent,
        wrappers: ['form-field'],
        defaultOptions: {
        },
    },
    { name: 'repeat', component: RepeatTypeComponent },
];
