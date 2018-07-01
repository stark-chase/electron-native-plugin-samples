#include <nan.h>

NAN_METHOD(GetGreetingMessage) {
    auto message = Nan::New<v8::String>("Welcome to the world of native modules in Electron!!!!").ToLocalChecked();
    info.GetReturnValue().Set(message);
} 

NAN_MODULE_INIT(Initialize) {
    NAN_EXPORT(target, GetGreetingMessage);
}

NODE_MODULE(greeting, Initialize)
