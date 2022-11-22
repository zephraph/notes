This is a scratch pad to dump ideas about a new operating system (or patterns of computing) that will improve our lives instead of detract from them. It'll mostly be described from the lens of mobile devices, though the concepts should be portable to desktop devices. 

## Rethinking applications

Modern smartphones are multi-media distribution platforms. The phone itself becomes a shell for the apps that 3rd party corporations deliver. The economic incentives broadly tilt towards the attention economy, rewarding app developers that can retain user's attention for longer periods of time. The platform itself often feels fragmented and incoherent. Worst still, apps are black boxes that have obscure access to your data and can easily become unmaintained locking you out of potentially necessary functionality (I'm talking about you, every startup that thinks you need to develop a dedicated app for your hardware).

I believe a device that empowers instead of distracts requires a fundamental rethink of the application model. Let's dig into what that could look like. 

### Unbundling Applications

Instead of the notion of a monolithic application, let's consider a set of smaller, limited abstractions. 

#### Service

A service is a small component that focuses on accessing system resources to accomplish a task. This may be accessing the network to interact with the API. It could listen for events and write data to disk. A service does _not_ draw to the screen though. 

Services have a distinct security model such that they're limited to specific resources. Services can be access and shared by other resources on the device.

#### Widget

A widget interacts with services and draws to the screen. That's it. You may have a calendar widget that displays a calendar on your screen. That widget can only have access to calendar data via interaction to a service that provides that data. 

#### Layout

A layout is a coordination engine that renders multiple widgets to create the state of a screen.


