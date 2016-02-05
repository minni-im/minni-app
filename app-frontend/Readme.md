# Application Frontend

The client side application of Minni.

## Main modules

* `actions` - [Flux][flux] actions creators.
* `layout` - handles the application main React layout.
* `stores` - [Flux][flux] stores.
* `models` - [Immutable JS][immutable-js] models definition.
* `utils` - Various utility classes.

## Components

The `/components` folder contains all the internal and generic React components (such as tabbars, spinner, buttons, links ...) used to build Minni UI across all Route modules.

## Libs

The `/libs` folder contains internal modules that power Minni (some of them override or enrich existing libraries, such as Immutable or Flux).

## Route modules

* `create` - The creation panel. When you want to create a new Minni organization (aka a team).
* `dashboard` - The main dashboard that list of available teams to the connected user.
* `chat` - The main container for a Minni organization chat.
  * `loby` - The lobby panel for a given organization.
  * `room` - The room panel. Displays information and messages relative to a given room.
  * `room-create` - Room creation panel.
  * `room-messages` - The room panel dedicated to messages display.
  * `room-settings` - Room settings panel.

* `settings` - Settings panel for a given organization.
* `user-settings` - The user setting panel.

[flux]: https://github.com/facebook/flux
[immutable-js]: https://github.com/facebook/immutable-js
