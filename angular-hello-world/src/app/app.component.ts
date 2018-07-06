import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'demo-app',
    templateUrl: require('./app.component.html'),
    styleUrls: [require('./app.component.scss')]
})
export class AppComponent implements OnInit {

    // This is a binding property for a message from the Greetings native module
    nativeModuleMessage: string;

    ngOnInit() {
        // Require the native module
        const greetingModule = require("../greeting-module");
        // Set the greeting message to the binding property
        this.nativeModuleMessage = greetingModule.greeting();
    }
}